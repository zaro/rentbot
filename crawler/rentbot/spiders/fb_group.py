# -*- coding: utf-8 -*-
import scrapy
from scrapy.conf import settings
import datetime
import dateparser
from ..items import RentbotItem
from ..util import normalizePrice, priceInEuro, normalizeLocationName
from urllib.parse import parse_qs, urlparse
import json

from .basespider import BaseSpider


def getUrlParam(url, param):
    o = urlparse(url)
    q = parse_qs(o.query)
    return q.get(param, [None])[-1]


def parseTime(timeText):
    return dateparser.parse(timeText, settings={'RELATIVE_BASE': datetime.datetime.now()})


class FbGroupSpider(BaseSpider):
    name = "fbGroup"
    GRAPH_EP = "https://graph.facebook.com/v2.9/"
    TOKEN = "2115363832023709|iV-Z9sug2YkMpYksXMgvfYi_A48"

    def make_request(self, url, **kwargs):
        if not url.startswith('https://'):
            url = self.GRAPH_EP + url
        joinChar = '&' if '?' in url else '?'
        url += joinChar + 'access_token=' + self.TOKEN
        return scrapy.Request(url=url, **kwargs)

    def start_requests(self):
        self.init_base_spider()

        try:
            self.stopAtSkipped = int(settings['STOP_AFTER_SKIPPED'])
        except:
            self.stopAtSkipped = None
        print(self.initial_urls)
        for url in self.initial_urls:
            yield self.make_request(url, callback=self.parseGroupPage)

    def parseGroupPage(self, response):
        feed = json.loads(response.text)
        for post in feed['data']:
            r = self.make_request(f'{post["id"]}/attachments', callback=self.parseAd)
            r.meta['post'] = post
            yield r
        try:
            until = getUrlParam(response.url, 'until')
            print('UNTIL', until)
            lastPostTime = datetime.datetime.fromtimestamp(int(until)) or datetime.datetime.now()
            print('lastPostTime', lastPostTime)
        except:
            lastPostTime = datetime.datetime.now()
        if self.skipLimitReached():
            return
        if "paging" in feed and "next" in feed["paging"]:
            if lastPostTime > (datetime.datetime.now() - datetime.timedelta(days=14)):
                print('NEXT PAGE')
                r = self.make_request(feed["paging"]["next"], callback=self.parseGroupPage)
                yield r

    def processAttachementList(self, aList):
        allowedTypes = set(['photo', 'share'])
        r = []
        for a in aList:
            if a['type'] in allowedTypes and "media" in a:
                r.append(a["media"]["image"]["src"])
            if "subattachments" in a and "data" in a["subattachments"]:
                r += self.processAttachementList(a["subattachments"]["data"])
        return r

    def parseAd(self, response):
        attachments = json.loads(response.text)
        post = response.meta['post']
        # Ignore posts w/o message
        if "message" not in post:
            return
        item = RentbotItem()
        item['url'] = 'https://facebook.com/' + post['id']
        item['source'] = 'facebook'
        item['source_id'] = post['id']
        timestamp = post.get('updated_time', post.get('created_time', None))
        if timestamp:
            item['time'] = parseTime(timestamp).isoformat()

        mList = post['message'].strip().split('\n')
        eIndex = ('' in mList) and mList.index('')
        if eIndex == 2:
            header = mList[0:eIndex]
            item['title'] = header[0]
            priceList = header[1].split('-')
            item['price'] = normalizePrice(priceList[0])
            item['price_euro'] = priceInEuro(item['price'])
            if len(priceList) > 1:
                item['location_name'] = normalizeLocationName(priceList[1])

            item['description'] = '\n'.join(mList[eIndex + 1:])
        else:
            item['description'] = post['message']
        item['images'] = self.processAttachementList(attachments.get("data", []))
        yield item

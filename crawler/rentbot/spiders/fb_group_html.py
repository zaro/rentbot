# -*- coding: utf-8 -*-
import scrapy
from scrapy.conf import settings
import datetime
import dateparser
from ..items import RentbotItem
from ..util import normalizePrice, priceInEuro, normalizeLocationName
from urllib.parse import parse_qs, urlparse

from .basespider import BaseSpider


def getAdId(url):
    o = urlparse(url)
    q = parse_qs(o.query)
    return q.get('id', [None])[-1]


def parseTime(timeText):
    return dateparser.parse(timeText, settings={'RELATIVE_BASE': datetime.datetime.now()})


class FbGroupSpider(BaseSpider):
    name = "fbGroupHtml"

    def start_requests(self):
        self.init_base_spider()

        try:
            self.stopAtSkipped = int(settings['STOP_AFTER_SKIPPED'])
        except:
            self.stopAtSkipped = None
        for url in self.initial_urls:
            yield scrapy.Request(url=url, callback=self.parseGroupPage)

    def parseGroupPage(self, response):
        adUrls = [response.urljoin(u) for u in response.css('#m_group_stories_container').xpath('//*[@role="article"]//a[.="Full Story"]').css('::attr("href")').extract()]
        for adUrl in adUrls:
            yield scrapy.Request(url=response.urljoin(adUrl), callback=self.parseAd)
        nextPage = response.urljoin(response.xpath('//span[contains(.//text(), "See More Posts")]/../../a/@href').extract_first())
        lastPostTime = parseTime(response.css('abbr::text')[-1].extract())
        if self.skipLimitReached():
            return
        if nextPage and lastPostTime > (datetime.datetime.now() - datetime.timedelta(days=14)):
            yield scrapy.Request(url=nextPage, callback=self.parseGroupPage)

    def parseAd(self, response):
        item = RentbotItem()
        item['url'] = response.url
        item['source'] = 'facebook'
        item['source_id'] = getAdId(response.url)
        article = response.css('#m_story_permalink_view')
        timeText = article.css('div > div > div > div >abbr::text').extract_first()
        item['time'] = parseTime(timeText).isoformat()

        titleDivs = article.css('div > div > div > div >div > div > div')
        if titleDivs:
            item['title'] = "".join(titleDivs[0].xpath('.//span[2]//text()').extract())
        if len(titleDivs) > 1:
            priceList = titleDivs[1].xpath('.//text()').re(r'\$?[,\d]+\s*\S+')
            if priceList:
                item['price'] = normalizePrice(priceList[0])
                item['price_euro'] = priceInEuro(item['price'])
        item['description'] = "".join(article.xpath('.//p//text()').extract())
        item['images'] = [response.urljoin(u) for u in article.css('div > div > div > div >div >div img::attr(src)').extract()]
        locationDivs = article.css('div > div > div > div >div >div>div')
        if len(locationDivs) >= 4:
            locationSpans = locationDivs[3].css('span::text').extract()
            if locationSpans:
                item['location_name'] = normalizeLocationName(locationSpans[-1])
        yield item

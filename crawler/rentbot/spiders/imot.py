# -*- coding: utf-8 -*-
import scrapy
import datetime
import re
from ..items import RentbotItem
from ..util import normalizePrice, priceInEuro, normalizeMonths
from urllib.parse import parse_qs, urlparse

from .basespider import BaseSpider


def getAdId(url):
    o = urlparse(url)
    q = parse_qs(o.query)
    return q.get('adv', [None])[-1]


class ImotSpider(BaseSpider):
    name = "imot"

    def start_requests(self):
        self.init_base_spider()

        urls = [
            #'https://www.imot.bg/pcgi/imot.cgi?act=3&slink=2sb6jx&f1=1',
            'https://naemi-sofia.imot.bg/'
        ]
        if self.initial_urls:
            urls = self.initial_urls

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parseAdList)

    def parseStartPage(self, response):
        regionsUrls = response.xpath('/html/body/div[3]/table[3]/tr[1]/td[1]/table[2]/tr[2]/td/a/@href').extract()
        for regionUrl in regionsUrls:
            yield scrapy.Request(url=response.urljoin(regionUrl), callback=self.parseAdList)

    def parseAdList(self, response):
        adUrlsRaw = response.css('a.photoLink::attr(href)').extract()
        adUrls = list(set(adUrlsRaw))
        for adUrl in adUrls:
            yield scrapy.Request(url=response.urljoin(adUrl), callback=self.parseAd)
        pagesLabels = response.xpath('.//a[contains(@class, "pageNumbers")]//text()').extract()
        curentPage = response.css('span.pageNumbersSelect::text').extract()[0]
        if self.skipLimitReached():
            return
        nexPageUrl = None
        for nextPage in [str(int(curentPage) + 1), 'Напред']:
            if nextPage in pagesLabels:
                nexPageUrl = response.xpath(f'.//a[contains(@class, "pageNumbers") and contains(.//text(), "{nextPage}")]/@href').extract_first()
                break
        if nexPageUrl:
            yield scrapy.Request(url=response.urljoin(nexPageUrl), callback=self.parseAdList)

    def parseAd(self, response):
        item = RentbotItem()
        item['url'] = response.url
        item['source'] = 'imot'
        item['source_id'] = getAdId(response.url)
        timeText = response.css('form > table > tr > td > div >span::text').extract_first()
        timeText = normalizeMonths(timeText)
        timeText = timeText.replace(u"на ", '')
        mo = re.search(r'(\d{1,2}:\d{1,2}\s+\d+\s+\w+,\s+\d+)', timeText.strip())
        item['time'] = datetime.datetime.strptime(mo.group(1), "%H:%M %d %b, %Y").isoformat()
        price = "".join(response.css('span#cena').xpath('.//text()').extract())
        item['price'] = normalizePrice(price)
        item['price_euro'] = priceInEuro(item['price'])
        item['title'] = response.css("h1::text").extract_first().strip()
        item['description'] = response.css("#description_div::text").extract_first().strip()
        images = response.xpath('//script[not(@src)]//text()').re(r"\s+var picts=[^']+(.*)\);")
        if images:
            images = images[0].split(",")
            item['images'] = [response.urljoin(u.strip().strip("'")) for u in images]
        item['location_name'] = response.css('form > table > tr > td > span::text')[1].extract()
        details = []
        for detail in response.css('form > table > tr > td > table')[1].css('tr'):
            td = detail.css('td')
            k = "".join(td[0].css('::text').extract()).strip().rstrip(':')
            v = "".join(td[1].css("::text").extract()).strip()
            details.append({'name': k, 'value': v})
        item['details'] = details
        item['bullets'] = response.css('form > table')[2].css('tr> td >div::text').extract()
        yield item

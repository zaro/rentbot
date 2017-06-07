# -*- coding: utf-8 -*-
import scrapy
import datetime
import re
from ..items import RentbotItem
from ..util import normalizePrice, priceInEuro, normalizeMonths

from .basespider import BaseSpider


class OlxSpider(scrapy.Spider):
    name = "olx"

    def start_requests(self):
        self.init_base_spider()

        urls = [
            'https://www.olx.bg/nedvizhimi-imoti/naemi/sofiya/',
        ]

        if self.initial_urls:
            urls = self.initial_urls

        for url in urls:
            yield scrapy.Request(url=url, callback=self.parseAdList)
        # Expired offer
        # yield scrapy.Request(url='https://www.olx.bg/ad/2-x-4gb-ddr3-hynix-ID6vwZh.html', callback=self.parseAd)

    def parseAdList(self, response):
        adUrlsRaw = response.css("a.detailsLink::attr(href)").extract()
        adUrls = list(set(adUrlsRaw))
        for adUrl in adUrls:
            yield scrapy.Request(url=adUrl, callback=self.parseAd)
        if self.skipLimitReached():
            return
        nextPage = response.css("span.next a.pageNextPrev::attr(href)").extract_first()
        if nextPage:
            yield scrapy.Request(url=nextPage, callback=self.parseAdList)

    def parseAd(self, response):
        item = RentbotItem()
        item['url'] = response.url
        item['source'] = 'olx'
        item['source_id'] = response.css(".offer-titlebox__details em > small::text").re(r'\d+')[0]
        timeText = "".join(response.css(".offer-titlebox__details em::text").extract())
        timeText = re.sub(r'\s+', ' ', timeText)
        timeText = normalizeMonths(timeText)
        mo = re.search(r'(\d{1,2}:\d{1,2},\s+\d+\s+\w+\s+\d+)', timeText.strip())
        item['time'] = datetime.datetime.strptime(mo.group(1), "%H:%M, %d %b %Y").isoformat()
        price = "".join(response.css('div.price-label').xpath('.//text()').extract())
        item['price'] = normalizePrice(price)
        item['price_euro'] = priceInEuro(item['price'])
        item['title'] = response.css(".offer-titlebox h1::text").extract_first().strip()
        item['description'] = "".join(response.css(".descriptioncontent p").xpath('.//text()').extract()).strip()
        item['images'] = response.css(".img-item img::attr(src)").extract()
        item['location_name'] = "".join(response.css('a.show-map-link:not([id])').css('::text').extract())
        details = []
        for detail in response.css(".details .item"):
            k = detail.css("th::text").extract_first()
            if k:
                k = k.strip()
                v = "".join(detail.css("td").css("::text").extract()).strip().rstrip(':')
                details.append({'name': k, 'value': re.sub(r'\s+', ' ', v)})
        item['details'] = details
        yield item

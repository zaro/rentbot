# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class RentbotItem(scrapy.Item):
    source_id = scrapy.Field()
    source = scrapy.Field()
    url = scrapy.Field()
    time = scrapy.Field()
    price = scrapy.Field()
    price_euro = scrapy.Field()
    title = scrapy.Field()
    description = scrapy.Field()
    images = scrapy.Field()
    local_images = scrapy.Field()
    details = scrapy.Field()
    bullets = scrapy.Field()
    location_name = scrapy.Field()

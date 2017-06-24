# -*- coding: utf-8 -*-
import scrapy
from scrapy.conf import settings


class BaseSpider(scrapy.Spider):
    initial_urls = []

    def init_base_spider(self):
        try:
            self.stopAtSkipped = int(settings['STOP_AFTER_SKIPPED'])
        except:
            self.stopAtSkipped = None

        for suffix in [''] + [f'_{s}' for s in range(0, 20)]:
            k = f'START_URL{suffix}'
            if settings[k]:
                self.initial_urls.append(settings[k])

    def skipLimitReached(self):
        skipped = self.crawler.stats.get_value('deltafetch/skipped') or 0
        if self.stopAtSkipped and (self.stopAtSkipped < skipped):
            #print('DF:', self.crawler.stats.get_value('deltafetch/skipped'))
            return True
        return False

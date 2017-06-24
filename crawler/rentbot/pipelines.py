# -*- coding: utf-8 -*-
from PIL import Image
from scrapy.conf import settings
import re
from scrapy.pipelines.images import ImagesPipeline
# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html


class RentbotPipeline(object):
    def process_item(self, item, spider):
        return item


class RentbotImagesPipeline(ImagesPipeline):

    def getImageSize(self, relPath):
        path = self.store._get_filesystem_path(relPath)
        x = {'path': path}
        im = Image.open(path)
        x['width'], x['height'] = im.size
        return x

    def item_completed(self, results, item, info):
        thumbnailKeys = settings.get('IMAGES_THUMBS', {}).keys()
        if isinstance(item, dict) or self.images_result_field in item.fields:
            res = []
            for ok, x in results:
                if ok:
                    s = self.getImageSize(x['path'])
                    x['width'], x['height'] = s['width'], s['height']
                    thumbnails = {}
                    for key in thumbnailKeys:
                        path = re.sub(r'^full', f'thumbs/{key}', x['path'], count=1)
                        s = self.getImageSize(path)
                        thumbnails[key] = s
                    x['thumbnails'] = thumbnails
                    res.append(x)
            item[self.images_result_field] = res
        return item

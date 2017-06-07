#!/usr/bin/env python

import argparse
import json
import datetime
from elasticsearch import Elasticsearch
import elasticsearch.exceptions

INDEX_SETTINGS = {
    "mappings": {
        "ad": {
            "properties": {
                "import_id": {"type": "keyword"},
                "import_date": {"type": "date", "format": "date_optional_time"},
                "source_id": {"type": "keyword"},
                "source": {"type": "keyword"},
                "url": {"type": "keyword"},
                "time": {"type": "date", "format": "date_optional_time"},
                "price": {"type": "string"},
                "price_euro": {"type": "double"},
                "title": {"type": "string", "analyzer": "bulgarian"},
                "description": {"type": "string", "analyzer": "bulgarian"},
                "images": {"type": "keyword"},
                "details": {"properties": {
                    "name": {"type": "string", "analyzer": "bulgarian"},
                    "value": {"type": "string", "analyzer": "bulgarian"},
                }},
                "bullets": {"type": "string", "analyzer": "bulgarian"},
                "location_name": {"type": "string", "analyzer": "bulgarian"},
            }
        }
    },
    "settings": {
        "analysis": {
            "filter": {
                "bulgarian_stop": {
                    "type": "stop",
                    "stopwords": "_bulgarian_"
                },
                "bulgarian_stemmer": {
                    "type": "stemmer",
                    "language": "bulgarian"
                }
            },
            "analyzer": {
                "bulgarian": {
                    "tokenizer": "standard",
                    "filter": [
                        "lowercase",
                        "bulgarian_stop",
                        "bulgarian_stemmer"
                    ]
                }
            }
        }
    }
}

importDate = datetime.datetime.now() #- datetime.timedelta(days=1)
indexName = 'rentbot-' + importDate.date().isoformat()

es = Elasticsearch(['localhost:9200'])
try:
    es.indices.create(indexName, body=INDEX_SETTINGS)
except elasticsearch.exceptions.RequestError as e:
    if e.error != 'index_already_exists_exception':
        raise


def importFeed(feedFileName):
    with open(feedFileName, 'r') as f:
        for line in f.readlines():
            doc = json.loads(line)
            doc['import_id'] = doc['source'] + '-' + doc['source_id']
            doc['import_date'] = importDate.isoformat()
            action = {
                '_index': indexName,
                '_type': 'ad',
                '_id': doc['import_id'],
                '_source': doc
            }
            print(doc)
            es.index(index=action['_index'], doc_type=action['_type'], id=action['_id'], body=action['_source'])


usage = "usage: %prog <feed>"
description = "Import rentbot feed into ES."
parser = argparse.ArgumentParser(description=description)
parser.add_argument("feed",
                    nargs="+",
                    help="Feed files to import")
args = parser.parse_args()

for feed in args.feed:
    importFeed(feed)


##

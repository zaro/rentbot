Get only freshest import from indexes:

```
GET /rentbot-2017-06-*/ad/_search
{
  "query": {
    "query_string" :{
      "query" : "shell"
    }
  },
  "collapse": {
    "field": "source_id"
  },
  "sort": [{"import_date": "desc"}]
}
```

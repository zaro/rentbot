const express = require('express')
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const app = express()
var nunjucks  = require('nunjucks');
var elasticsearch = require('elasticsearch');

var es = new elasticsearch.Client({
  host: 'localhost:9200',
});

app.use(bodyParser.json({ strict: true }));
app.use(expressValidator([])); // this line must be immediately after any of the bodyParser middlewares!


var webpackDevMiddleware = require("webpack-dev-middleware");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config");
var compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath: "/static/" // Same as `output.publicPath` in most cases.
}));

nunjucks.configure('templates', {
  autoescape: true,
  express   : app
});

app.get('/', function (req, res) {
  res.render('index.html', {});
})

const searchSchema = {
  'q' : {
    notEmpty: true,
    errorMessage: 'Invalid query'
  },
  'orQ':{
    matches: {
      options: ['and|or', 'i']
    },
    errorMessage: 'Invalid operation' // Error message for the parameter
  },
  'sortBy':{
    matches: {
      options: ['price_euro|time', 'i']
    },
    errorMessage: 'Invalid sort by' // Error message for the parameter
  },
  'sortOrder':{
    matches: {
      options: ['asc|desc', 'i']
    },
    errorMessage: 'Invalid sort order' // Error message for the parameter
  },
  count:{
    isBoolean: {
      options:{}
    }
  },
  from: {
    isInt: {}
  },
  size: {
    isInt: {}
  }

}

app.post('/search', function (req, res) {
  req.checkBody(searchSchema);
  req.getValidationResult().then(function(validationResult) {
    if (!validationResult.isEmpty()) {
      res.status(400).json({"error": validationResult.array()});
      return;
    }
    const {q, orQ, sortBy, sortOrder, count, from, size } = req.body;
    const body = {
        "query": {
            "query_string": {
                "query": q,
                "default_operator": orQ,
            }
        },
    }
    const index = `<rentbot-{now/d{YYYY-MM-dd}}>`;
    let result;
    if (count) {
      result = es.count({index, body});
    } else {
      body["sort"] = [
          {[sortBy]: {"order": sortOrder}}
      ]
      body["from"] = from;
      body["size"] = size;
      //console.log('BODY', body);
      result = es.search({index, body});
    }
    result.then(function (resp) {
        res.json(resp);
        //var hits = resp.hits.hits;
    }, function (err) {
      console.error(err.message);
        res.json(err);
    });
  });
})

app.use(express.static('static'))

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

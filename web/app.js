const express = require('express')
const expressValidator = require('express-validator');
var responseTime = require('response-time')
var morgan = require('morgan')
const bodyParser = require('body-parser');
const app = express()
var nunjucks  = require('nunjucks');
var elasticsearch = require('elasticsearch');
const DEV_MODE = process.env.NODE_ENV != 'production';

// Server side render
var DEFAULT_OPTIONS = {
  babel: {
    presets: [ 'react', 'es2015',  "stage-0" ],
  },
  only: 'ui/',
  cache: !DEV_MODE
};
var assign = require('object-assign');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
require('babel-register')(DEFAULT_OPTIONS.babel);

//const index = `<rentbot-{now/d{YYYY-MM-dd}}>`;
const ES_INDEX = 'rentbot-all';


// Configure express app
app.set('trust proxy', true)

app.use(responseTime())

// Render jsx as views
// app.set('views', __dirname + '/ui');
// app.set('view engine', 'jsx');
// app.engine('jsx', require('express-react-views').createEngine());

var es = new elasticsearch.Client({
  host: 'localhost:9200',
});

if (app.settings.env === 'development' ) {
  app.use(morgan('combined'));
}

app.use(bodyParser.json({ strict: true }));
app.use(expressValidator({ customValidators: {
    isArray: function(value) {
        return Array.isArray(value);
    },
}})); // this line must be immediately after any of the bodyParser middlewares!


if (app.settings.env === 'development' ) {
  var webpackDevMiddleware = require("webpack-dev-middleware");
  var webpack = require("webpack");
  var webpackConfig = require("./webpack.config");
  var compiler = webpack(webpackConfig);

  app.use('/static', express.static('static'))
  app.use(webpackDevMiddleware(compiler, {
    publicPath: "/js/" // Same as `output.publicPath` in most cases.
  }));
}

nunjucks.configure('templates', {
  autoescape: true,
  express   : app,
  noCache: DEV_MODE,
});

app.get(['/', '/fav'], function (req, res) {
  res.render('index.html', {});
})

const searchSchema = {
  'q' : {
    //notEmpty: true,
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
  count:{ isBoolean: {} },
  minPrice: { isInt: {} },
  maxPrice: { isInt: {} },
  from: { isInt: {} },
  size: { isInt: {} },

}

app.post('/api/search', function (req, res) {
  req.checkBody(searchSchema);
  req.getValidationResult().then(function(validationResult) {
    if (!validationResult.isEmpty()) {
      res.status(400).json({"error": validationResult.array()});
      return;
    }
    const {orQ, sortBy, sortOrder, count, from, size } = req.body;
    let {q, minPrice, maxPrice} = req.body;
    if (minPrice <= 0) {
      minPrice = '*';
    }
    if (maxPrice <= 0) {
      maxPrice = '*';
    }
    if (minPrice !== '*' || maxPrice !== '*'){
      const cond = ` price_euro:[${minPrice} TO ${maxPrice}]`
      if (orQ === 'or') {
        q = `(${q}) AND ${cond}`
      } else {
        q = `${q} ${cond}`
      }
    }
    const body = {
        "query": {
            "query_string": {
                "query": q,
                "default_operator": orQ,
            }
        },
    }
    const index = ES_INDEX;
    let result;
    if (count) {
      result = es.count({index, body});
    } else {
      body["sort"] = [
          {[sortBy]: {"order": sortOrder}}
      ]
      body["from"] = from;
      body["size"] = size;
      console.log('BODY', body);
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

const getSchema = {
  'id' : {
    //notEmpty: true,
    isArray: {
      errorMessage: 'Invalid id',
    }
  },
}

app.post('/api/get', function (req, res) {
  req.checkBody(getSchema);
  req.getValidationResult().then(function(validationResult) {
    if (!validationResult.isEmpty()) {
      res.status(400).json({"error": validationResult.array()});
      return;
    }
    const {id} = req.body;
    const index = ES_INDEX;
    const body = {
      "docs": id.map((v) => { return {"_id" : v};})
    }
    console.log(body);
    const result = es.mget({index, type: 'ad', body});
    result.then(function (resp) {
        res.json(resp);
        //var hits = resp.hits.hits;
    }, function (err) {
      console.error(err.message);
        res.json(err);
    });
  });
})


function singleAdPage(req, res) {
  es.get({index: ES_INDEX, type: 'ad', id: req.params.docId}).then((doc) =>{
    var component = require('./ui/server/ad');
    // Transpiled ES6 may export components as { default: Component }
    component = component.default || component;
    doc._source._id = doc._id;
    const markup = ReactDOMServer.renderToStaticMarkup(
      React.createElement(component, {ad: doc._source, userAgent: req.headers['user-agent']})
    );
    //console.log(doc);
    res.render('ad.html', {markup});
  }).catch(e => {
    if (e.statusCode == 404) {
      res.render('404.html', {});
    } else {
      res.end('FAILED: ' + e + '\n' +e.stack)
    }
  })

}

app.get('/:docId/:ignore', singleAdPage);
app.get('/:docId', singleAdPage);

app.listen(8080, function () {
  console.log('Example app listening on port 8080!')
})

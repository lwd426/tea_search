var app = require('koa')()
  , router = require('koa-router')()
  , logger = require('koa-logger')
  , json = require('koa-json')
  , views = require('koa-views')
  , onerror = require('koa-onerror')
    , cors = require('koa-cors');
const convert = require('koa-convert');
const bodyparser = require('koa-bodyparser')();
const index = require('./backend/routes/index');
// const parse = require('./backend/parse/utils')


// var menu = require('./routes/menu');

// global middlewares
app.use(views('views', {
  root: __dirname + '/views',
  default: 'jade'
}));


//跨域处理
app.use(cors());
app.use(bodyparser);
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));


//支持jsonp
app.use(function *(next) {
    yield next;
    var callback = this.query["callback"];
    if (!callback) return;
    this.type = 'text/javascript';
    var startChunk =  callback + '(';
    var endChunk = ');'
    this.body =  startChunk + JSON.stringify(this.body) + endChunk;
});


app.use(function *(next){
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

router.use(index.routes(), index.allowedMethods());

// mount root routes
app.use(router.routes(), router.allowedMethods());
// routes definition
// app.use(router.routes(), );


app.on('error', function(err, ctx){
    console.log('server error:'+err + ' ' + JSON.stringify(ctx));
    logger.error('server error', err, ctx);
});

module.exports = app;

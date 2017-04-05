var router = require('koa-router')();
var lib = require('../cha/api')
var rq = require('../cha/request')
var url =  'http://api.map.baidu.com/place/v2/search'
var ak =  'oiEutVru1rnLPMj2USktYVFLM6BPijf3'

router.get('/', function *(next) {
    var i = 0,len=10;
    var data = {
        query: '茶',
        region: '北京',
        city_limit: true,
        output: 'json',
        scope: 2,
        ak : ak,
        page_size: 20
    }
    var results = []
    for(;i<len;i++){
        var result =  yield rq.search(url,data);
        results = results.concat(result.results)
    }
    var filepath = yield lib.save(results);
    this.body = filepath;
    this.body = {
        status: 'success',
        data: filepath
    };
});


module.exports = router;

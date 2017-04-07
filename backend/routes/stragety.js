var router = require('koa-router')();
var lib = require('../services/stragety')
const uuidV4 = require('uuid/v1');

router.get('/', function *(next) {
    var tgid = this.query.tgid || '';
    var slbid = this.query.slbid || '';
    var result = yield lib.getStragetyList({tgid: tgid, slbid: slbid})
    this.body = {
        status: 'success',
        data: result
    };
});

router.post('/', function *(next) {
    var slbid = this.request.body.slbid;
    var tgid = this.request.body.tgid;
    var name = this.request.body.name;
    var desc = this.request.body.desc;
    var cities = this.request.body.cities;
    var servers = this.request.body.servers;
    var urls = this.request.body.urls;
    var uids = this.request.body.uids;
    var uuid = uuidV4();
    var result = yield lib.saveStragety(uuid, slbid,tgid,name,desc,cities,servers,urls,uids)
    if(result){
        this.body = {
            status: 'success',
            data: result
        };
    }else{
        this.body = {
            status: 'failure',
            data: ['服务器错误']
        };
    }

});

router.del('/', function *(next) {
    var code = this.request.body.code;
    var result = yield lib.deleteStragety({code:code})
    this.body = {
        status: 'success',
        data: result
    };
});
router.put('/', function *(next) {
    var where = this.request.body.where;
    var data = this.request.body.data;
    var result = yield lib.updateStragety(data, where)
    this.body = {
        status: 'success',
        data: result
    };
});

module.exports = router;


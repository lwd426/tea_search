var router = require('koa-router')();
var lib = require('../services/webserver')

router.get('/', function *(next) {
    var slbid = this.query.slbid;
    var result = yield lib.getWebServerList(slbid)
    this.body = {
        status: 'success',
        data: result
    };
});

router.post('/', function *(next) {
    var key = this.request.body.key;
    var slbid = this.request.body.slbid;
    var ip = this.request.body.ip;
    var address = this.request.body.address;
    var backup = this.request.body.backup;
    var refer = this.request.body.refer;

    var result = yield lib.saveWebServer(key, slbid, ip, address, backup, refer)
    this.body = result;
});

router.del('/', function *(next) {
    var key = this.request.body.key;
    var slbid = this.request.body.slbid;
    var result = yield lib.deleteWebServer(slbid, {key:key})
    this.body = {
        status: result.status,
        data: result
    };
});
router.put('/', function *(next) {
    var where = this.request.body.where;
    var data = this.request.body.data;
    var result = {}
    if(where.other){
        result = yield lib.updateWebServer(data, undefined, [where.other], where.type)
    }else{
        result = yield lib.updateWebServer(data, where)
    }
    this.body = {
        status: 'success',
        data: result
    };
});

router.put('/refer', function *(next) {
    var where = this.request.body.where;
    var data = this.request.body.data;
    if(!data.refer) data.stragetiesinfo = [];
    var result = yield lib.updateWebServer(data, undefined, [{opt: 'in', key: 'key', data: where.data}])
    this.body = {
        status: 'success',
        data: result
    };
});



module.exports = router;


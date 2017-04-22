var router = require('koa-router')();
var lib = require('../services/testgroup')
var libStragety = require('../services/stragety')
var libServer = require('../services/webserver')

router.get('/', function *(next) {
    var slbid = this.query.slbid;
    var result = yield lib.getTestgroupList(slbid)
    this.body = {
        status: 'success',
        data: result
    };
});

router.post('/', function *(next) {
    var name = this.request.body.name;
    var code = this.request.body.code;
    var slbid = this.request.body.slbid;
    var servers = yield libServer.getServersInfo({slbid: slbid}, []);
    if(servers.length ===0){
        this.body =  {
            status: 'failure',
            data: '没有服务器，请先添加服务器！'
        };
    }else{
        var result = yield lib.saveTestgroup(name, code, slbid)
        this.body = {
            status: 'success',
            data: result
        };
    }

});

router.del('/', function *(next) {
    var code = this.request.body.code;

    var result = yield lib.deleteTest(code);
    if(result.status === 'failure') {
        this.body = result;
    }else{
        //删除测试组下的所有策略
        yield libStragety.deleteStragety({tgid: code})
        this.body = result;
    }

});
router.put('/', function *(next) {
    var where = this.request.body.where;
    var data = this.request.body.data;
    var result = yield lib.updateTest(data, where)
    this.body = {
        status: 'success',
        data: result
    };
});

module.exports = router;


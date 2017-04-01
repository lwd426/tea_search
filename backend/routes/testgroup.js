var router = require('koa-router')();
var lib = require('../services/testgroup')

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
    var result = yield lib.saveTestgroup(name, code, slbid)
    this.body = {
        status: 'success',
        data: result
    };
});

router.del('/', function *(next) {
    var code = this.request.body.code;
    var result = yield lib.deleteTest({code:code})
    this.body = {
        status: 'success',
        data: result
    };
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


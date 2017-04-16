var router = require('koa-router')();
var lib = require('../services/versionlog')

router.get('/', function *(next) {
    var tgid = this.query.tgid;
    var result = yield lib.getVersionlogList(tgid)
    this.body = {
        status: 'success',
        data: result
    };
});





router.post('/', function *(next) {
    var name = this.request.body.name;
    var result = yield lib.saveSlb(name)
    this.body = {
        status: 'success',
        data: result
    };
});

module.exports = router;

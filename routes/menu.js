var router = require('koa-router')();
var lib = require('../lib')

router.get('/', function *(next) {
    var result = yield lib.getMenuList()
    this.body = {
        status: 'success',
        data: result
    };
});

router.post('/', function *(next) {
  var name = this.request.body.name;
  var result = yield lib.saveMenu(name)
    this.body = {
    status: 'success',
    data: result
};
});

router.del('/', function *(next) {
    var objID = this.request.body.id;
    var result = yield lib.deleteMenu(objID)
    this.body = {
        status: 'success',
        data: result
    };
});

module.exports = router;

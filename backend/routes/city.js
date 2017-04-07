var router = require('koa-router')();
var lib = require('../services/stragety/city')

router.get('/', function *(next) {
    var result = yield lib.getCities()
    this.body = {
        status: 'success',
        data: result
    };
});


module.exports = router;

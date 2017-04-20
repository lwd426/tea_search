var router = require('koa-router')();
var lib = require('../services/virtualhost')

router.get('/getbyname/:name', function *(next) {
    var name = this.params.name;
    //调用发布接口
    var result = yield lib.getByName(name);
    if(result) {
        this.body = {
            status: 'success',
            data: result
        }
    }else{
        this.body = {
            status: 'failure',
            data: result
        }

    }
});

module.exports = router;

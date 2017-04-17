var router = require('koa-router')();
var lib = require('../services/slb')

router.get('/', function *(next) {
    var result = yield lib.getSlbList()
    var objectId = this.query.objectId;
    var result = yield lib.getSlbList(objectId)
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

router.del('/', function *(next) {
    var objID = this.request.body.id;
    var result = yield lib.deleteSlb(objID)
    this.body = {
        status: 'success',
        data: result
    };
});
router.put('/', function *(next) {
    var where = this.request.body.where;
    var data = this.request.body.data;
    var result = yield lib.updateSlb(where, data)
    this.body = {
        status: 'success',
        data: result
    };
});

router.get('/publish', function *(next) {
    var slbid = this.query.slbid;
    var tgid = this.query.tgid;
    var versiondesc = this.query.versiondesc;
    var versionnum = this.query.versionnum;
    //调用发布接口
    var result = yield lib.publish(slbid, tgid, versionnum, versiondesc)
    this.body = {
        status: 'success',
        data: result
    };
});


router.get('/publish/back', function *(next) {
    var tgid = this.query.tgid;
    var slbid = this.query.slbid;
    var versionkey = this.query.versionkey;
    var result = yield lib.publishBack(slbid, tgid, versionkey);
    if(result){
        this.body = {
            status: 'success',
            data: result
        };
    }else{
        this.body = {
            status: 'failure',
            data: '失败'
        };
    }

});

module.exports = router;

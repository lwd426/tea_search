var router = require('koa-router')();
var lib = require('../services/slb')
var libTg = require('../services/testgroup');
var libStragety = require('../services/stragety')
var libVir = require('../services/virtualhost');
var moment = require('moment')

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
  var domain = this.request.body.domain;
  var domainId = this.request.body.domainId;
  var result = yield lib.saveSlb(name,domain, domainId);
    this.body = result;
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

router.get('/vertifyDomianId', function* (next) {
    var domainName = this.query.domainName;
    var result = yield libVir.getByName(domainName);
    this.body = result;
})

router.get('/publish', function *(next) {
    var slbid = this.query.slbid;
    var domainId = this.query.domainId;
    var tgid = this.query.tgid;
    var versiondesc = this.query.versiondesc;
    var versionnum = this.query.versionnum;
    //调用发布接口
    var result = yield lib.publish(domainId,slbid, tgid, versionnum, versiondesc);
    //更新测试组的发布时间信息
    if(result.status && result.status === 'failure'){
        this.body = {
            status: 'failure',
            data: result.info
        };
    }else if(result.status === 'success') {
            var strageties = yield libStragety.getStragetyInfos({tgid: tgid})
            var status = 'stopped'
            strageties.map((stra)=>{
                if(stra.get('stra_status') === 'running'){
                    status = 'running'
                }
            })
        result = yield libTg.updateTest({time: moment().format('YYYY-MM-DD HH:mm'), version: result.stra_info, status: status}, {objectId: tgid})
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
    }

});


router.get('/publish/back', function *(next) {
    var tgid = this.query.tgid;
    var domainId = this.query.domainId;
    var slbid = this.query.slbid;
    var versionkey = this.query.versionkey;
    var result = yield lib.publishBack(domainId,slbid, tgid, versionkey);
    console.log(result)
    //更新测试组的发布时间信息
    if(result.status && result.status === 'failure'){
        this.body = {
            status: 'failure',
            data: result.info
        };
    }else if(result.status === 'success') {
        result = yield libTg.updateTest({time: moment().format('YYYY-MM-DD HH:mm'), version: result.stra_info}, {objectId: tgid});

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
    }
});

module.exports = router;

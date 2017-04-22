var router = require('koa-router')();
var lib = require('../services/slb')
var libTg = require('../services/testgroup');
var libStragety = require('../services/stragety')
var libVir = require('../services/virtualhost');
const uuid = require('uuid/v1');

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
    var domain = this.query.domain;
    var port = this.query.port;
    var domainId = this.query.domainId;
    var tgid = this.query.tgid;
    var versiondesc = this.query.versiondesc;
    var versionnum = this.query.versionnum;
    //调用发布接口
    var snapcode = uuid();
    var result = yield lib.publish(domain, port, domainId,slbid, tgid, versionnum, versiondesc, snapcode);
    //更新测试组的发布时间信息
    if(result.status && result.status === 'failure'){
        this.body = {
            status: 'failure',
            data: result.info
        };
    }else if(result.status === 'success') {
        //更新策略组的发布时间
        var tg = yield libTg.getTgInfo(tgid);
        var data = {time: moment().format('YYYY-MM-DD HH:mm'), version: result.stra_info, status: 'running'}
        //如果是第一次发布，则更新first_publish_time字段
        if(tg[0].get('time') === '-') data.first_publish_time = moment().format('YYYY-MM-DD HH:mm');
        result = yield libTg.updateTest(data, {objectId: tgid})
        //更新策略组下的所有策略的发布时间
        result = yield libStragety.updateStragety({time: moment().format('YYYY-MM-DD HH:mm')}, {tgid: tgid})
        //生成测试项目的快照
        yield libStragety.generateSnap(snapcode,tgid)
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
    var domain = this.query.domain;
    var port = this.query.port;
    var domainId = this.query.domainId;
    var nowSnapcode = this.query.nowsnapcode;
    var newSnapcode = this.query.snapcode;
    var slbid = this.query.slbid;
    var versionkey = this.query.versionkey;
    var versiondesc = this.query.versiondesc;
    var result = yield lib.publishBack(newSnapcode, domain, port, domainId,slbid, tgid, versionkey,versiondesc);
    //更新测试组的发布时间信息
    if(result.status && result.status === 'failure'){
        this.body = {
            status: 'failure',
            data: result.info
        };
    }else if(result.status === 'success') {
        result = yield libTg.updateTest({time: moment().format('YYYY-MM-DD HH:mm'), version: result.stra_info}, {objectId: tgid});
        //更新策略组下的所有策略的发布时间
        result = yield libStragety.updateStragety({time: moment().format('YYYY-MM-DD HH:mm')}, {tgid: tgid})
        yield libStragety.changeStragetySnap(nowSnapcode, newSnapcode,tgid)

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

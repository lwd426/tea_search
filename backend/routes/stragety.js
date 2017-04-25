var router = require('koa-router')();
var lib = require('../services/stragety')
var libTg = require('../services/testgroup')
var moment = require('moment');

const uuidV4 = require('uuid/v1');

router.get('/', function *(next) {
    var tgid = this.query.tgid || '';
    var slbid = this.query.slbid || '';
    var result = yield lib.getStragetyList({tgid: tgid, slbid: slbid})
    this.body = {
        status: 'success',
        data: result
    };
});

router.get('/handler', function *(next) {
    var stra_id = this.query.stra_id;
    var tgid = this.query.tgid;
    var status = this.query.status;
    //更新策略组下的所有策略的发布时间
    result = yield lib.updateStragety({stra_status: status}, {key: stra_id})
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
router.post('/', function *(next) {
    var slbid = this.request.body.slbid;
    var tgid = this.request.body.tgid;
    var name = this.request.body.name;
    var desc = this.request.body.desc;
    var cities = this.request.body.cities;
    var servers = this.request.body.servers;
    var serverskey = this.request.body.serverskey;
    var urls = this.request.body.urls;
    var uids = this.request.body.uids;
    var type = this.request.body.type;
    var uuid = uuidV4();
    var result = yield lib.saveStragety(uuid, slbid,tgid,name,desc,cities,servers,serverskey,urls,uids,type)
    if(result){
        this.body = {
            status: 'success',
            data: result
        };
    }else{
        this.body = {
            status: 'failure',
            data: ['服务器错误']
        };
    }

});

router.del('/', function *(next) {
    var stra_id = this.request.body.code;
    var result = yield lib.deleteStragety({objectId:stra_id})
    this.body = {
        status: 'success',
        data: result
    };
});
router.put('/', function *(next) {
    var where = this.request.body.where;
    var data = this.request.body.data;
    var result = yield lib.updateStragety(data, where, [])
    this.body = {
        status: 'success',
        data: result
    };
});

/**
 * 为指定slb的测试组下的所有策略生成标签
 * 规则：如果该测试组下的策略已有标签，则不进行生成；
 * 只针对没有标签的策略从库里随机取出标签，更新对应的策略信息，返回给前台
 */
router.get('/tag', function *(next) {
    var tgid = this.query.tgid || '';
    var slbid = this.query.slbid || '';

    //取出该测试组下所有的策略
    var stragetylist = yield lib.getStragetyList({tgid: tgid, slbid: slbid})

    //取出10个未被分配的标签
    // var tags = yield lib.getTags(10);
    //循环策略数组，把未被标识的策略打上标识，保存
    var i=0, len = stragetylist.length;

    for(;i<len;i++){
        var stragety = stragetylist[i];
        console.log(stragety.get("tag"))
        if(!stragety.get("tag")) {
            // if(tags.length === 0){//如果没有tag了，则告知用户
            //     this.body = {
            //         status: 'failure',
            //         info: '无空闲标签可用，请联系乐视视频相关同事'
            //     }
            //     return false;
            // }
            var tag = Math.random().toString(36).slice(2,8);
            // stragety.set("tag",tag.tag_value);
            yield lib.updateStragety({"tag": tag}, {'objectId': stragety.id});
            stragety.set('tag',tag);
            // stragetys_marked.push(stragety);
        }
    }
    this.body = {
        status: 'success',
        data: stragetylist
    };
});

module.exports = router;


var router = require('koa-router')();
var lib = require('../services/charts')

router.post('/trafficData/', function *(next) {

    console.log(this.request.body)
    var stragety_arr = this.request.body.stragety_arr || '';
    var startTime = this.request.body.startTime || '';
    var endTime = this.request.body.endTime || '';
    var data = {};
    
    data['start'] = startTime;
    data['end'] = endTime;
    data['gls'] = stragety_arr;

    //调用大数据接口
    var result = yield lib.getTrafficDataByStragety(data);
    this.body = result;
});

router.post('/conversionData/', function *(next) {

    console.log(this.request.body)
    var stragety_arr = this.request.body.stragety_arr || '';
    var startTime = this.request.body.startTime || '';
    var endTime = this.request.body.endTime || '';
    var linkVal = this.request.body.linkVal;
    var data = {};
    
    data['start'] = startTime;
    data['end'] = endTime;
    data['gls'] = stragety_arr;

    //调用大数据接口
    var result = yield lib.getConversionDataByStragety(data, linkVal);
    this.body = result;
});

router.post('/duijiData/', function *(next) {

    console.log(this.request.body)
    var stragety_arr = this.request.body.stragety_arr || '';
    var startTime = this.request.body.startTime || '';
    var endTime = this.request.body.endTime || '';
    var linkVal = this.request.body.linkVal;
    var stragetyVal = this.request.body.stragety_str
    var data = {};
    
    data['start'] = startTime;
    data['end'] = endTime;
    data['gls'] = stragety_arr;

    //调用大数据接口
    var result = yield lib.getDuijiDataByStragety(data, stragetyVal, linkVal);
    this.body = result;
});


//test
router.get('/trafficData/:name', function *(next) {
    var name = this.params.name;
    //调用发布接口
    //var result = yield lib.getByName(name);
    if(true) {
        this.body = {
            status: 'success',
            data: 'lalalalala'
        }
    }else{
        this.body = {
            status: 'failure',
            data: result
        }
    }
});

module.exports = router;

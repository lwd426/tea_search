var router = require('koa-router')();
var lib = require('../services/charts')

router.post('/trafficData/', function *(next) {

    console.log(this.request.body)
    var stragety_arr = this.request.body.stragety_arr || '';
    var startTime = this.request.body.startTime || '';
    var endTime = this.request.body.endTime || '';
    let data = {};
    
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
    let data = {};
    
    data['start'] = startTime;
    data['end'] = endTime;
    data['gls'] = stragety_arr;
    console.log(data)

    //调用大数据接口
    var result = yield lib.getConversionDataByStragety(data);
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

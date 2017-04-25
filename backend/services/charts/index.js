/**
 * 用途： 图表服务入口
 * 应提供功能： 从mysql数据库读取必要数据并根据echarts指定图表逻辑生成图表配置项和数据项
 * 开发者：侯泽洲
 * Created by hzz on 21/4/30.
 */
var json2csv = require('json2csv');
var iconv = require('iconv-lite');
var utils = require('./utils')
var fs = require('fs');

var db = require('../../datasource/charts');

function getAverageNumArr(arr){
    let sum = 0;
    let length = arr.length
    arr.map((v,i) => {
        sum += v;
    })
    let average = sum/length;
    return average
}

module.exports = {
    getTrafficDataByStragety: function *(data){
        console.log(data)
        var res = yield db.post('get_statistic_uv/', data);
        var responseData = res.result.data;

        if(responseData.length == 0){
            return '无数据'
        }
        if(res.result.status == 'error'){
            return 'error'
        }

        var tableData = [];
        var fields = ['date','useramount'];
        var fieldNames = ['日期', '访客总数'];
        responseData.map((val,index) => {
            tableData.push({
                date: val.date,
                useramount: val.uv_all,
                uv: {},
                pv: {}
            })
            var arr_uv = Object.entries(val.uv);
            arr_uv.map((v,i) => {
                tableData[index]['uv'][v[0]] = v[1].pvuv;
                tableData[index]['pv'][v[0]] = v[1].pv;
            })
        });

        var stra_arr = Object.entries(responseData[0].uv);
        stra_arr.map((v,i) => {
            fields.push('uv.' + v[0]);
            fields.push('pv.' + v[0]);
            fieldNames.push('版本' + v[1].name + 'UV');
            fieldNames.push('版本' + v[1].name + 'PV');
        })

        var csv = json2csv({ data: tableData, fields: fields, fieldNames: fieldNames });
        var newCsv = iconv.encode(csv, 'GBK'); // 转编码
        fs.writeFileSync('file-traffic.csv', newCsv, function(err) {
          if (err) throw err;
          console.log('file-traffic saved');
        });
        
        // var filepath = 'usercallbacks'+ moment().valueOf() +'.csv';
        // fse.mkdirsSync('public/csv/')
        // var dataBuffer = Buffer.concat([new Buffer('\xEF\xBB\xBF', 'binary'), new Buffer(csv)]);
        // var result = fse.outputFileSync('public/csv/'+filepath, dataBuffer);
        // resolve('csv/' + filepath)

        // var filepath = yield utils.save_csv(result);
        // return filepath;
        return tableData;
    },
    getConversionDataByStragety: function *(data, linkVal){
        var res = yield db.post('get_statistic_action/', data);
        var responseData = res.result.data;
        let strageties = Object.entries(responseData);

        var tableData = [];
        var fields = ['strtagetyName','uv', 'pv', 'show', 'click', 'percent'];
        var fieldNames = ['版本', 'UV 访客数', 'PV 浏览数', '曝光', '点击', '转化率 / %'];

        let percentObj = {};
        let percentNumObj = {}
        let uvObj = {};
        let pvObj = {};
        let showObj = {};
        let clickObj = {};
        let strtagetyNameObj = {};

        //循环赋值
        for(let key in responseData){
            percentObj[key] = [];
            percentNumObj[key] = [];
            uvObj[key] = [];
            pvObj[key] = [];
            showObj[key] = [];
            clickObj[key] = [];
            strtagetyNameObj[key] = []

            for(let k in responseData[key]){
                percentObj[key][k] = [];
                percentNumObj[key][k] = [];
                uvObj[key][k] = [];
                pvObj[key][k] = [];
                showObj[key][k] = [];
                clickObj[key][k] = [];

                responseData[key][k].map((val,index) => {
                    //percentObj[key][k].push((val.click_count*100/val.show_count).toFixed(2));
                    percentNumObj[key][k].push(val.click_count*100/val.show_count);
                    uvObj[key][k].push(val.uv);
                    pvObj[key][k].push(val.pv);
                    showObj[key][k].push(val.show_count);
                    clickObj[key][k].push(val.click_count);
                    strtagetyNameObj[key] = val.name;
                })
            }
        }

        strageties.map((v,i) => {
            tableData.push({
                strtagetyName: strtagetyNameObj[v[0]],
                uv: Math.round(getAverageNumArr(uvObj[v[0]][linkVal])),
                pv: Math.round(getAverageNumArr(pvObj[v[0]][linkVal])),
                show: Math.round(getAverageNumArr(showObj[v[0]][linkVal])),
                click: Math.round(getAverageNumArr(clickObj[v[0]][linkVal])),
                percent: (getAverageNumArr(percentNumObj[v[0]][linkVal])).toFixed(2) + '%',
            })
        });

        var csv = json2csv({ data: tableData, fields: fields, fieldNames: fieldNames });
        var newCsv = iconv.encode(csv, 'GBK'); // 转编码
        fs.writeFileSync('file-conversion.csv', newCsv, function(err) {
          if (err) throw err;
          console.log('file saved');
        });

        return tableData;
    },
    getDuijiDataByStragety: function *(data, stragetyVal, linkVal){
        var res = yield db.post('get_statistic_action/', data);
        var responseData = res.result.data;

        var tableData = [];
        var fields = ['date','show', 'click', 'click_rate'];
        var fieldNames = ['日期', '曝光', '点击', '点击率'];
        //循环赋值 tableData
        tableData = [];
        responseData[stragetyVal][linkVal].map((val,index) => {
            tableData.push({
                date: val.date,
                show: val.show_count,
                click: val.click_count,
                click_rate: (val.click_count*100/val.show_count).toFixed(2) + '%',
            })
        })

        var csv = json2csv({ data: tableData, fields: fields, fieldNames: fieldNames });
        var newCsv = iconv.encode(csv, 'GBK'); // 转编码
        fs.writeFileSync('file-duiji.csv', newCsv, function(err) {
          if (err) throw err;
          console.log('file saved');
        });
        return tableData;
    }
}





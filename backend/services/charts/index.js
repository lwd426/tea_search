/**
 * 用途： 图表服务入口
 * 应提供功能： 从mysql数据库读取必要数据并根据echarts指定图表逻辑生成图表配置项和数据项
 * 开发者：侯泽洲
 * Created by hzz on 21/4/30.
 */
var json2csv = require('json2csv');
var iconv = require('iconv-lite');
var fs = require('fs');

var db = require('../../datasource/charts');

module.exports = {
    getTrafficDataByStragety: function *(data){
        console.log(data)
        var res = yield db.post('get_statistic_uv/', data);
        let responseData = res.result.data.reverse();

        let tableData = [];
        var fields = ['date','useramount'];
        var fieldNames = ['日期', '访客总数'];
        responseData.map((val,index) => {
            tableData.push({
                date: val.date,
                useramount: val.uv_all,
                visit: {},
                percent: {}
            })
            let arr_uv = Object.entries(val.uv);
            arr_uv.map((v,i) => {
                tableData[index]['visit'][v[0]] = v[1].count;
                tableData[index]['percent'][v[0]] = (v[1].count*100/val.uv_all).toFixed(2);

                fields.push('visit.' + v[0]);
                fields.push('percent.' + v[0]);

                fieldNames.push('版本' + v[1].name + '访客数');
                fieldNames.push('版本' + v[1].name + '访问用户比例');
            })
        })

        var csv = json2csv({ data: tableData, fields: fields, fieldNames: fieldNames });
        var newCsv = iconv.encode(csv, 'GBK'); // 转编码
        fs.writeFileSync('file.csv', newCsv, function(err) {
          if (err) throw err;
          console.log('file saved');
        });

        return tableData
    },
    getConversionDataByStragety: function *(data){
        console.log(data)
        let result = yield db.post('get_statistic_action/', data);
        return result
    }
}





/**
 * 用途： 设备维护服务入口
 * 应提供功能： slb信息的增删改查、服务器的增删改查和相应的条件限制逻辑（比如正在服役的服务器不能删除）
 * 开发者：侯泽洲
 * Created by lwd426 on 17/3/30.
 */

var utils = require('../utils');
var moment = require('moment')
var fse = require('fs-extra')
var json2csv = require('json2csv');
var cache = require('../utils/cache');
var chart = require('./chart')

function columns_gen(sitetype) {
    var i = 1;
    var result = {}
    if(sitetype === 'msite'){
        result.columns = ['srctype', 'sname','date','uid','phone','desc','bac','url','ip'];
        result.fieldNames = ['反馈来源', '错误类型','时间','用户UID','联系方式','描述','备注','页面地址','ip'];
        result.cell = {
            "srctype":''
            ,"bname":''
            ,"sname":''
            ,"date":''
            ,"uid":''
            ,"phone":''
            ,"desc":''
            ,"bac":''
            ,"url":''
            ,"ip":''
        };
    }else{
        result.columns = ['srctype', 'bname','sname','date','uid','phone','desc','bac','url','ip'];
        result.fieldNames = ['反馈来源', '错误大类','错误类型','时间','用户UID','联系方式','描述','备注','页面地址','ip'];
        result.cell = {
            "srctype":''
            ,"bname":''
            ,"sname":''
            ,"date":''
            ,"uid":''
            ,"phone":''
            ,"desc":''
            ,"bac":''
            ,"url":''
            ,"ip":''
        };
    }
    return result;
}
function deepCopy(p, c)=> {
    var c = c || {};
    for (var i in p) {
        if (typeof p[i] === 'object') {
            c[i] = (p[i].constructor === Array) ? [] : {};
            deep(p[i], c[i]);
        } else {
            c[i] = p[i];
        }
    }
    return c;
}
module.exports = {
    save_csv: function *(data) {
        var fs = require('fs');
        var columnsinfo = columns_gen();
        var fields = columnsinfo.columns;
        var fieldNames = columnsinfo.fieldNames;
        var construct = columnsinfo.cell;
        var infos = []
        data.map((obj) => {
            var cell = deepCopy(construct);
            fields.map((key)=>{
                cell[key] = obj[key]

            })
            infos.push(cell);
        })
        var csv = json2csv({ data: infos, fields: fields,fieldNames: fieldNames, unwindPath: 'colors' });
        return new Promise((resolve,reject)=>{
            var filepath = 'data'+ moment().valueOf() +'.csv';
            fse.mkdirsSync('public/csv/')
            var dataBuffer = Buffer.concat([new Buffer('\xEF\xBB\xBF', 'binary'), new Buffer(csv)]);
            var result = fse.outputFileSync('public/csv/'+filepath, dataBuffer);
            resolve('csv/' + filepath)
        })

    }
}
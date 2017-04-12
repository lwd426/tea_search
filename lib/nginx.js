"use strict";
var if_1 = require("./if");
var check_1 = require("./check");
var four_1 = require("./four");
var defaultUpstream = "defaultUpstream";
var geoip_city = "/etc/maxmind-city.mmdb";
var geoip_subdivisions = "/etc/maxmind-subdivisions.mmdb";
var allServers = [];
var needDefault = false;
var Upstream = (function () {
    function Upstream(meta) {
        this.type = 'url';
        this.index = 0;
        this.metaData = meta;
        this.init();
    }
    Upstream.prototype.init = function () {
        this.upStreamName = this.getUpstreamName();
    };
    Upstream.prototype.doit = function () {
        var location = needDefault ? this.getLocation() : '';
        var upstreams = this.getUpstream();
        return {
            location: location,
            upstreams: upstreams
        };
    };
    Upstream.prototype.getLocation = function () {
        var url = this.metaData.url || '/';
        var upStreamName = this.upStreamName;
        return "\n        location " + url + " { \n                    proxy_pass http://$" + upStreamName + "; \n        }\n        ";
    };
    Upstream.prototype.getUpstreamName = function () {
        return this.metaData.url == "/" ? defaultUpstream : this.type + "_" + this.metaData.serverArray[this.index];
    };
    Upstream.prototype.getUpstream = function () {
        var n = this.upStreamName;
        var s = '';
        this.metaData.serverArray.forEach(function (ip) {
            s += "\n                    server " + ip + ";\n               ";
        });
        return "\n                upstream " + n + " { \n                     ip_hash;\n                      " + s + "\n                }\n                ";
    };
    return Upstream;
}());
//如果uid或者region有效，则生成一个upstream group, 对于哪种不需要生成group的，还是使用另外一个函数吧
function array2one(arr) {
    var arr2 = [];
    var _loop_1 = function (v) {
        if (Array.isArray(v.urlArray) && v.urlArray.length) {
            v.urlArray.forEach(function (item) {
                arr2.push(Object.assign({}, v, { url: item || '/' }));
            });
        }
    };
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var v = arr_1[_i];
        _loop_1(v);
    }
    arr2.forEach(function (item) {
        if (item.default) {
            delete item.regionArray;
            delete item.uidArray;
        }
        for (var i in item) {
            if (Array.isArray(item[i]) && !item[i].length) {
                delete item[i];
            }
        }
        delete item.urlArray; //
    });
    return arr2;
}
function nginx(arr) {
    needDefault = true;
    arr = array2one(arr);
    allServerHandler(arr);
    var verf = new check_1.Verify(arr);
    var re = verf.check();
    if (re.code != 0) {
        console.log(re);
        return re;
    }
    // arr = array2one(arr);
    arr.forEach(function (item) {
        if (item.url == '/' && !item.default) {
            needDefault = false;
        }
    });
    var geo = geoIp(arr);
    var wjgz = wanjianguizong(arr);
    /*const res = arr.map(item => {
     delete item.urlArray;
     if (item.uidArray && item.regionArray) {

     return new three(item, allServers).doit();
     }
     return item.uidArray || item.regionArray ? new UpstreamGroup(item, allServers).doit() : new Upstream(item).doit();
     }); */
    var res = wjgz.map(function (item) {
        return item.servers ? new four_1.four(item, allServers).doit() : new Upstream(item).doit();
    });
    var content = "" + geo;
    var groups = '';
    var upstreams = '';
    var location = '';
    for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
        var i = res_1[_i];
        groups += i.group || "";
        upstreams += i.upstreams || "";
        location += i.location || "";
    }
    content += upstreams;
    content += groups;
    content += location;
    console.log(content);
    re.content = content;
    return re;
}
function geoIp(arr) {
    var flag = false;
    for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
        var v = arr_2[_i];
        flag = flag || !!v.regionArray;
    }
    if (!flag) {
        return '';
    }
    var geoLevel = if_1.level;
    var geoip_ = eval('geoip_' + geoLevel);
    var geo1p2 = "\n           #\u4F7F\u7528geoip2 \u901A\u8FC7ip\u83B7\u53D6\u4F4D\u7F6E\u4FE1\u606F\n           geoip2 " + geoip_ + " {\n            $geoip2_data_" + geoLevel + "_name default=Beijing " + geoLevel + " names en;\n           }";
    return geo1p2;
}
function allServerHandler(arr) {
    for (var _i = 0, arr_3 = arr; _i < arr_3.length; _i++) {
        var v = arr_3[_i];
        if (v.default) {
            allServers = [].concat(v.serverArray);
        }
    }
    for (var _a = 0, arr_4 = arr; _a < arr_4.length; _a++) {
        var v = arr_4[_a];
        for (var _b = 0, _c = v.serverArray; _b < _c.length; _b++) {
            var k = _c[_b];
            if (allServers.indexOf(k) == -1) {
                allServers.push(k);
            }
        }
    }
}
function wanjianguizong(arr) {
    var array = [];
    var _loop_2 = function (v) {
        if (v.default) {
            array.push(v);
            return "continue";
        }
        var o = { url: v.url, servers: [] };
        //还得处理相同的url归一的问题
        array.forEach(function (item) {
            if (item.url == v.url) {
                o.servers = item.servers;
            }
        });
        if (v.uidArray) {
            o.servers.push({
                uids: v.uidArray,
                servers: v.serverArray
            });
        }
        //不能是else if 因为有的会uid和地域都有
        if (v.regionArray) {
            o.servers.push({
                regions: v.regionArray,
                servers: v.serverArray
            });
        }
        array.push(o);
    };
    for (var _i = 0, arr_5 = arr; _i < arr_5.length; _i++) {
        var v = arr_5[_i];
        _loop_2(v);
    }
    return array;
}
module.exports = nginx;

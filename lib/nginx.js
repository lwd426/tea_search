"use strict";
var if_1 = require("./if");
var check_1 = require("./check");
var four_1 = require("./four");
var defaultUpstream = "defaultUpstream";
var allServers = [];
var needDefault = false;
var Upstream = (function () {
    function Upstream(meta) {
        this.type = 'url';
        this.index = 0;
        this.metaData = meta;
        this.metaData.serverArray = allServers; //先这么写吧
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
        return "\n        location " + url + " { \n                    proxy_pass http://" + upStreamName + "; \n        }\n        ";
    };
    Upstream.prototype.getUpstreamName = function () {
        return this.metaData.url == "/" ? defaultUpstream : this.type + "_" + this.metaData.serverArray[this.index].replace(/\./g, '_').replace(/\:/g, '_');
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
                if (item.default) {
                }
                else {
                    delete item[i];
                }
            }
        }
        delete item.urlArray; //
    });
    return arr2;
}
function nginx(arr, domain, port) {
    if (domain === void 0) { domain = 'test.m.le.com'; }
    if (port === void 0) { port = '80'; }
    needDefault = true;
    //let domain = 'test.m.le.com';//todo
    //先加上开始
    arr.forEach(function (item) {
        for (var i = 0; i < item.serverArray.length; i++) {
            var vs = item.serverArray[i].split('.');
            var v3 = vs[3];
            vs[3] = '188';
            item.serverArray[i] = vs.join(".") + ":9" + v3;
        }
    });
    //先加上结束
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
    content += "\n    server {\n        listen  " + port + ";\n        server_name " + domain + ";\n        " + location + "\n    }\n    ";
    // content += location;
    console.log(content);
    re.content = content.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    return re;
}
function geoIp(arr) {
    for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
        var v = arr_2[_i];
        if (v.regionArray) {
            return if_1.geo1p2DB;
        }
    }
    return '';
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
        if (v.default) {
            continue;
        }
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
        var flag = false;
        //还得处理相同的url归一的问题
        array.forEach(function (item) {
            if (item.url == v.url) {
                flag = true;
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
        o.servers.sort(function (a, b) {
            return a.uids ? -1 : 1;
        });
        !flag && array.push(o); //因为多个合并成一个，所以不用再次push了
    };
    for (var _i = 0, arr_5 = arr; _i < arr_5.length; _i++) {
        var v = arr_5[_i];
        _loop_2(v);
    }
    return array;
}
module.exports = nginx;

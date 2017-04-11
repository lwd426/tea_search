"use strict";
var defaultUpstream = "defaultUpstream";
var geoipCity = "/etc/maxmind-city.mmdb";
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
        var location = this.getLocation();
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
var UpstreamGroup = (function () {
    function UpstreamGroup(meta) {
        this.index = 0;
        this.metaData = meta;
        this.init();
    }
    UpstreamGroup.prototype.init = function () {
        if (Array.isArray(this.metaData.regionArray) && this.metaData.regionArray.length) {
            this.type = 'url_region';
        }
        else if (this.metaData.uidArray.length) {
            this.type = 'url_uid';
        }
        this.groupName = this.getGroupName();
        this.map = Array.isArray(this.metaData.regionArray) && this.metaData.regionArray.length ? this.metaData.regionArray : this.metaData.uidArray;
    };
    UpstreamGroup.prototype.doit = function () {
        var location = this.getLocation();
        var group = this.getGroup();
        var upstreams = this.getUpstream();
        return {
            location: location,
            group: group,
            upstreams: upstreams
        };
    };
    UpstreamGroup.prototype.getLocation = function () {
        var url = this.metaData.url || '/';
        var groupName = this.groupName;
        return "\n        location " + url + " { \n                    proxy_pass http://$" + groupName + "; \n        }\n        ";
    };
    UpstreamGroup.prototype.getGroupName = function () {
        var name = '';
        var rand = (Math.random() + "").slice(-5);
        name = this.type + "_" + rand;
        return name;
    };
    UpstreamGroup.prototype.getGroup = function () {
        var groupName = this.groupName;
        var cookie = "";
        var geo1p2 = "\n           #\u4F7F\u7528geoip2 \u901A\u8FC7ip\u83B7\u53D6\u57CE\u5E02\u4FE1\u606F\n           geoip2 " + geoipCity + " {\n            $geoip2_data_city_name default=Beijing city names en;\n           }";
        if (this.type == 'url_region') {
            cookie = '$geoip2_data_city_name';
        }
        else if (this.type == 'url_uid') {
            cookie = '$COOKIE_uid';
            geo1p2 = '';
        }
        var regName = this.getGroupContent();
        return "\n        " + geo1p2 + "\n        map " + cookie + " $" + groupName + " {\n            " + regName + "\n           \n       } ";
    };
    UpstreamGroup.prototype.getGroupContent = function () {
        var arr = this.map;
        var s = "\n                #\u5199\u6B63\u5219\u548C\u5BF9\u5E94\u7684upstream\u7684name";
        var keyss = '';
        keyss = arr.join("|");
        var name = this.getUpstreamName();
        s += "\n                ~* \"" + keyss + "\" " + name + ";\n            ";
        s += "default " + defaultUpstream + ";"; // default
        return s;
    };
    //搞到一个个的upstream
    UpstreamGroup.prototype.getUpstreams = function () {
        var _this = this;
        var str = '';
        var arr = this.map;
        arr.forEach(function (item) {
            var r = _this.getUpstream(item);
            str += "\n            " + r + "\n            ";
        });
        return str;
    };
    UpstreamGroup.prototype.getUpstreamName = function () {
        return this.groupName + "_" + this.metaData.serverArray[this.index];
    };
    UpstreamGroup.prototype.getUpstream = function (opt) {
        if (opt === void 0) { opt = this.metaData.serverArray; }
        var n = this.getUpstreamName();
        var s = '';
        opt.forEach(function (ip) {
            s += "\n                    server " + ip + ";\n               ";
        });
        return "\n                upstream " + n + " { \n                     ip_hash;\n                      " + s + "\n                }\n                ";
    };
    return UpstreamGroup;
}());
var Verify = (function () {
    function Verify(arr) {
        this.arr = arr;
    }
    Verify.prototype.check = function () {
        try {
            this.serverSingle();
            this.url();
            this.hasDefault();
            return {
                code: 0,
                data: ''
            };
        }
        catch (e) {
            return e;
        }
    };
    Verify.prototype.hasDefault = function () {
        var flag = false;
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var v = _a[_i];
            flag = !!v.default || flag;
        }
        if (!flag) {
            throw {
                code: 3,
                data: "\u6CA1\u6709\u9ED8\u8BA4\u7684"
            };
        }
    };
    Verify.prototype.getServers = function () {
        var arr = [];
        this.arr.forEach(function (item) {
            arr = arr.concat(item.serverArray);
        });
        return arr;
    };
    Verify.prototype.serverSingle = function () {
        var arr = this.getServers();
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var v = arr_1[_i];
            if (arr.indexOf(v) !== arr.lastIndexOf(v)) {
                throw {
                    code: 1,
                    data: v + "\u51FA\u73B0\u4E86\u591A\u6B21"
                };
            }
        }
        //ok 啥都没有
    };
    Verify.prototype.url = function () {
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var v = _a[_i];
            if (!v.url) {
                throw { code: 2, data: "有个没填url" };
            }
        }
    };
    return Verify;
}());
function array2one(arr) {
    var arr2 = [];
    var _loop_1 = function (v) {
        if (Array.isArray(v.url) && v.url.length) {
            v.url.forEach(function (item) {
                arr2.push(Object.assign({}, v, { url: item }));
            });
        }
        else if (typeof v.url === "string") {
            arr2.push(v);
        }
    };
    for (var _i = 0, arr_2 = arr; _i < arr_2.length; _i++) {
        var v = arr_2[_i];
        _loop_1(v);
    }
    arr2.forEach(function (item) {
        for (var i in item) {
            if (Array.isArray(item[i]) && !item[i].length) {
                delete item[i];
            }
        }
    });
    return arr2;
}
function nginx(arr) {
    var verf = new Verify(arr);
    var re = verf.check();
    if (re.code != 0) {
        return re;
    }
    arr = array2one(arr);
    var res = arr.map(function (item) {
        return item.uidArray || item.regionArray ? new UpstreamGroup(item).doit() : new Upstream(item).doit();
    });
    var content = '';
    for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
        var i = res_1[_i];
        content += i.group || "";
        content += i.upstreams || "";
        content += i.location || "";
    }
    console.log(content);
    re.content = content;
    return re;
}
module.exports = nginx;

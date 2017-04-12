"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var if_1 = require("./if");
var check_1 = require("./check");
var UpstreamGroup = (function () {
    function UpstreamGroup(meta, allServers) {
        this.index = 0;
        this.metaData = meta;
        this.allServers = allServers;
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
        var geoLevel = if_1.conf.level;
        var geoip_ = if_1.conf[eval("'geoip_' + geoLevel")];
        if (this.type == 'url_region') {
            cookie = "$geoip2_data_" + geoLevel + "_name";
        }
        else if (this.type == 'url_uid') {
            cookie = '$COOKIE_uid';
        }
        var regName = this.getGroupContent();
        return "\n        map " + cookie + " $" + groupName + " {\n            " + regName + "\n           \n       } ";
    };
    UpstreamGroup.prototype.getGroupContent = function () {
        var arr = this.map;
        var s = "\n                #\u5199\u6B63\u5219\u548C\u5BF9\u5E94\u7684upstream\u7684name";
        var keyss = '';
        keyss = arr.join("|");
        var name = this.getUpstreamName();
        s += "\n                ~*\"" + keyss + "\" " + name + ";\n            ";
        s += "default " + this.getUpstreamName() + "_default;"; // default
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
        return "\n                upstream " + n + " { \n                     ip_hash;\n                      " + s + "\n                }\n                " + this.getDefault();
    };
    UpstreamGroup.prototype.getDefault = function () {
        var n = this.getUpstreamName();
        var s = '';
        var cha = check_1.Methods.differenceSet(this.allServers, this.metaData.serverArray);
        cha.forEach(function (ip) {
            s += "\n                    server " + ip + ";\n               ";
        });
        return "\n                upstream " + n + "_default { \n                     ip_hash;\n                      " + s + "\n                }\n                ";
    };
    return UpstreamGroup;
}());
exports.UpstreamGroup = UpstreamGroup;

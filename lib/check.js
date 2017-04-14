"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*RegExp.escape = function(text) {
 return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
 };*/
var CODE = {
    "OK": 0,
    "CONTAIN": 1,
    "NO_DEFAULT": 2,
    "MUCH_DEFAULT": 3,
    "JIAOJI": 4,
    "URL_UID": 5,
    "NO_UID_REGION": 6
};
var Methods = (function () {
    function Methods() {
    }
    Methods.contain = function (first, sec) {
        // let firstReg=new RegExp(RegExp.escape(first),'');
        if (first == "/" && sec != "/" || sec == "/" && first != '/') {
            return false;
        }
        if (first == sec) {
            return true;
        }
        var firstReg = new RegExp(first, 'i');
        if (first.indexOf("~ ") > -1) {
            first = first.trim().slice(2).trim();
            firstReg = new RegExp(first, '');
        }
        else if (first.indexOf("~* ") > -1) {
            first = first.trim().slice(2).trim();
            firstReg = new RegExp(first, 'i');
        }
        var secReg = new RegExp(sec, '');
        if (sec.indexOf("~ ") > -1) {
            sec = sec.trim().slice(2).trim();
            secReg = new RegExp(sec, '');
        }
        else if (sec.indexOf("~* ") > -1) {
            sec = sec.trim().slice(2).trim();
            secReg = new RegExp(sec, 'i');
        }
        return firstReg.test(sec) || secReg.test(first);
    };
    Methods.containArray = function (firstArr, secArr) {
        // let firstReg=new RegExp(RegExp.escape(first),'');
        var flag = false;
        for (var _i = 0, firstArr_1 = firstArr; _i < firstArr_1.length; _i++) {
            var v = firstArr_1[_i];
            for (var _a = 0, secArr_1 = secArr; _a < secArr_1.length; _a++) {
                var v2 = secArr_1[_a];
                flag = flag || this.contain(v, v2);
            }
        }
        return flag;
    };
    Methods.intersection = function (arr1, arr2) {
        var arr3 = arr1.concat(arr2);
        for (var _i = 0, arr3_1 = arr3; _i < arr3_1.length; _i++) {
            var v = arr3_1[_i];
            if (arr3.indexOf(v) != arr3.lastIndexOf(v)) {
                return v;
            }
        }
    };
    //计算两个数组的差集
    Methods.differenceSet = function (superarr, arr) {
        var array = [];
        for (var _i = 0, superarr_1 = superarr; _i < superarr_1.length; _i++) {
            var v = superarr_1[_i];
            if (arr.indexOf(v) == -1) {
                array.push(v);
            }
        }
        return array;
    };
    return Methods;
}());
exports.Methods = Methods;
var Verify = (function () {
    function Verify(arr) {
        this.arr = arr;
    }
    Verify.prototype.check = function () {
        try {
            // this.serverSingle();
            // this.url();
            this.lack();
            this.checkUrl(); //包含,并且不能相等
            this.hasDefault(); //有没有default是true的
            this.sameURLdiffServer();
            return {
                code: CODE.OK,
                data: ''
            };
        }
        catch (e) {
            return e;
        }
    };
    Verify.prototype.hasDefault = function () {
        var flag = false;
        var arr = [];
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var v = _a[_i];
            arr.push(!!v.default);
        }
        if (arr.indexOf(true) == -1) {
            throw {
                code: CODE.NO_DEFAULT,
                data: "\u6CA1\u6709default"
            };
        }
        else if (arr.indexOf(true) != arr.lastIndexOf(true)) {
            throw {
                code: CODE.MUCH_DEFAULT,
                data: "\u597D\u51E0\u4E2Adefault"
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
    Verify.prototype.checkUrl = function () {
        var flag = false;
        for (var i = 0; i < this.arr.length; i++) {
            for (var j = i + 1; j < this.arr.length; j++) {
                if (Methods.contain(this.arr[i].url, this.arr[j].url)) {
                    //如果url一样，在判断uid和地域是不是有重复
                    if (this.arr[i].default || this.arr[j].default) {
                        continue;
                    }
                    if (this.arr[i].url == this.arr[j].url) {
                        var flag_1 = false;
                        if (Array.isArray(this.arr[i].uidArray) && Array.isArray(this.arr[j].uidArray)) {
                            var ccc = Methods.intersection(this.arr[i].uidArray, this.arr[j].uidArray);
                            if (ccc) {
                                throw {
                                    code: CODE.URL_UID,
                                    data: this.arr[i].url + "\u76F8\u540C\u4F46\u662Fuid:" + ccc + "\u591A\u6B21"
                                };
                            }
                        }
                        if (Array.isArray(this.arr[i].regionArray) && Array.isArray(this.arr[j].regionArray)) {
                            var ccc = Methods.intersection(this.arr[i].regionArray, this.arr[j].regionArray);
                            if (ccc) {
                                throw {
                                    code: CODE.URL_UID,
                                    data: this.arr[i].url + "\u76F8\u540C\u4F46\u662Fregion:" + ccc + "\u591A\u6B21"
                                };
                            }
                        }
                        console.log(this.arr[i].url, "相同");
                        continue;
                    }
                    //包含的时候还要看看uid和地域信息，如果uid无交集并且服务器无交集，就行
                    //同样，如果地域无交集并且服务器
                    if (Array.isArray(this.arr[i].uidArray) && Array.isArray(this.arr[j].uidArray)
                        && !Methods.intersection(this.arr[i].uidArray, this.arr[j].uidArray)
                        && !Methods.intersection(this.arr[i].serverArray, this.arr[j].serverArray)) {
                        continue;
                    }
                    if (Array.isArray(this.arr[i].regionArray) && Array.isArray(this.arr[j].regionArray)
                        && !Methods.intersection(this.arr[i].regionArray, this.arr[j].regionArray)
                        && !Methods.intersection(this.arr[i].serverArray, this.arr[j].serverArray)) {
                        continue;
                    }
                    throw {
                        code: CODE.CONTAIN,
                        data: this.arr[i].url + "\u548C" + this.arr[j].url + "\u6709\u95EE\u9898,\u5305\u542B\uFF1F"
                    };
                }
            }
        }
    };
    Verify.prototype.url = function () {
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var v = _a[_i];
            if (Array.isArray(v.urlArray) && !v.urlArray.length) {
                v.urlArray.push("/");
                //throw {code: 2, data: "有个没填url"}
            }
            else if (Array.isArray(v.urlArray) && v.urlArray.length) {
                for (var i = 0; i < v.urlArray.length; i++) {
                    if (v.urlArray[i] === '') {
                        v.urlArray[i] = '/';
                    }
                }
            }
        }
    };
    Verify.prototype.url2 = function () {
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var v = _a[_i];
            if (v.url === "") {
                v.url = "/";
            }
        }
    };
    Verify.prototype.sameURLdiffServer = function () {
        for (var i = 0; i < this.arr.length; i++) {
            for (var j = i + 1; j < this.arr.length; j++) {
                if (this.arr[i].url == this.arr[j].url) {
                    var v = Methods.intersection(this.arr[i].serverArray, this.arr[j].serverArray);
                    if (v) {
                        throw {
                            code: CODE.JIAOJI,
                            data: this.arr[i].url + "\u4E0B" + v + "\u7528\u4E86\u591A\u6B21\u4E86\u5427"
                        };
                    }
                }
            }
        }
    };
    Verify.prototype.lack = function () {
        for (var _i = 0, _a = this.arr; _i < _a.length; _i++) {
            var v = _a[_i];
            var noUid = !v.uidArray || Array.isArray(v.uidArray) && !v.uidArray.length;
            var noReg = !v.regionArray || Array.isArray(v.regionArray) && !v.regionArray.length;
            if (noReg && noUid && !v.default) {
                throw {
                    code: CODE.NO_UID_REGION,
                    data: v
                };
            }
        }
    };
    return Verify;
}());
exports.Verify = Verify;
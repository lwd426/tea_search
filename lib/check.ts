/*RegExp.escape = function(text) {
 return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
 };*/
const CODE = {
    "OK": 0,
    "CONTAIN": 1,
    "NO_DEFAULT": 2,
    "MUCH_DEFAULT": 3,
    "JIAOJI": 4,
    "URL_UID": 5,
    "NO_UID_REGION": 6
};
class Methods {
    static contain(first, sec): boolean {//url是否包含,包含返回true
        // let firstReg=new RegExp(RegExp.escape(first),'');
        if (first == "/" && sec != "/" || sec == "/" && first != '/') {//
            return false;
        }
        if (first == sec) {//相等不行
            return true;
        }
        let firstReg = new RegExp(first, 'i');
        if (first.indexOf("~ ") > -1) {//区分大小写
            first = first.trim().slice(2).trim();
            firstReg = new RegExp(first, '');
        } else if (first.indexOf("~* ") > -1) {//不区分大小写
            first = first.trim().slice(2).trim();
            firstReg = new RegExp(first, 'i');
        }

        let secReg = new RegExp(sec, '');
        if (sec.indexOf("~ ") > -1) {//区分大小写
            sec = sec.trim().slice(2).trim();
            secReg = new RegExp(sec, '');
        } else if (sec.indexOf("~* ") > -1) {//不区分大小写
            sec = sec.trim().slice(2).trim();
            secReg = new RegExp(sec, 'i');
        }
        return firstReg.test(sec) || secReg.test(first)
    }

    static containArray(firstArr, secArr) {//url是否包含,是的话true
        // let firstReg=new RegExp(RegExp.escape(first),'');
        let flag = false;
        for (let v of firstArr) {
            for (let v2 of secArr) {
                flag = flag || this.contain(v, v2);
            }
        }
        return flag;
    }

    static intersection(arr1: string[], arr2: string[]) {//交集
        let arr3 = arr1.concat(arr2);
        for (let v of arr3) {
            if (arr3.indexOf(v) != arr3.lastIndexOf(v)) {
                return v;
            }
        }
    }

    //计算两个数组的差集
    static differenceSet(superarr, arr) {
        let array = [];
        for (let v of superarr) {
            if (arr.indexOf(v) == -1) {
                array.push(v);
            }
        }
        return array;
    }
}

class Verify {
    arr: any[];

    constructor(arr) {
        this.arr = arr;
    }

    check() {
        try {
            // this.serverSingle();
            // this.url();
            this.lack();
            this.checkUrl();//包含,并且不能相等
            this.hasDefault();//有没有default是true的
            this.sameURLdiffServer();
            return {
                code: CODE.OK,
                data: ''
            };
        } catch (e) {
            return e;
        }
    }

    private hasDefault() {
        let flag = false;
        let arr: boolean[] = [];
        for (let v of this.arr) {
            arr.push(!!v.default);
        }
        if (arr.indexOf(true) == -1) {
            throw {
                code: CODE.NO_DEFAULT,
                data: `没有default`
            };
        } else if (arr.indexOf(true) != arr.lastIndexOf(true)) {
            throw {
                code: CODE.MUCH_DEFAULT,
                data: `好几个default`
            };
        }
    }

    private getServers() {
        let arr = [];
        this.arr.forEach(item => {
            arr = arr.concat(item.serverArray);
        });
        return arr;
    }

    serverSingle() {//判断ip地址是不是只出现了一次
        let arr = this.getServers();
        for (let v of arr) {
            if (arr.indexOf(v) !== arr.lastIndexOf(v)) {
                throw {
                    code: 1,
                    data: `${v}出现了多次`
                };
            }
        }
        //ok 啥都没有
    }

    private checkUrl() {//url是否有包含关系
        let flag = false;
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = i + 1; j < this.arr.length; j++) {
                if (Methods.contain(this.arr[i].url, this.arr[j].url)) {
                    //如果url一样，在判断uid和地域是不是有重复

                    if (this.arr[i].default || this.arr[j].default) {
                        continue;
                    }
                    if (this.arr[i].url == this.arr[j].url) {
                        let flag = false;
                        if (Array.isArray(this.arr[i].uidArray) && Array.isArray(this.arr[j].uidArray)) {
                            const ccc = Methods.intersection(this.arr[i].uidArray, this.arr[j].uidArray);
                            if (ccc) {
                                throw {
                                    code: CODE.URL_UID,
                                    data: `${this.arr[i].url}相同但是uid:${ccc}多次`
                                }
                            }
                        }
                        if (Array.isArray(this.arr[i].regionArray) && Array.isArray(this.arr[j].regionArray)) {
                            const ccc = Methods.intersection(this.arr[i].regionArray, this.arr[j].regionArray);
                            if (ccc) {
                                throw {
                                    code: CODE.URL_UID,
                                    data: `${this.arr[i].url}相同但是region:${ccc}多次`
                                }
                            }
                        }
                        console.log(this.arr[i].url, "相同");
                        continue;
                    }
                    //包含的时候还要看看uid和地域信息，如果uid无交集并且服务器无交集，就行
                    //同样，如果地域无交集并且服务器
                    if(Array.isArray(this.arr[i].uidArray)&&Array.isArray(this.arr[j].uidArray)
                        &&!Methods.intersection(this.arr[i].uidArray,this.arr[j].uidArray)
                        &&!Methods.intersection(this.arr[i].serverArray,this.arr[j].serverArray)){
                        continue;
                    }
                    if(
                        Array.isArray(this.arr[i].regionArray)&&Array.isArray(this.arr[j].regionArray)
                        &&!Methods.intersection(this.arr[i].regionArray,this.arr[j].regionArray)
                        &&!Methods.intersection(this.arr[i].serverArray,this.arr[j].serverArray)){
                        continue;
                    }
                    throw {
                        code: CODE.CONTAIN,
                        data: `${this.arr[i].url}和${this.arr[j].url}有问题,包含？`
                    }
                }
            }
        }
    }

    url() {
        for (let v of this.arr) {//todo
            if (Array.isArray(v.urlArray) && !v.urlArray.length) {
                v.urlArray.push("/");
                //throw {code: 2, data: "有个没填url"}
            } else if (Array.isArray(v.urlArray) && v.urlArray.length) {
                for (let i = 0; i < v.urlArray.length; i++) {
                    if (v.urlArray[i] === '') {
                        v.urlArray[i] = '/'
                    }
                }
            }
        }
    }

    url2() {
        for (let v of this.arr) {//todo

            if (v.url === "") {
                v.url = "/"
            }
        }
    }

    private sameURLdiffServer() {//相同url,不使用相同的灰度服务器
        for (let i = 0; i < this.arr.length; i++) {
            for (let j = i + 1; j < this.arr.length; j++) {
                if (this.arr[i].url == this.arr[j].url) {
                    let v = Methods.intersection(this.arr[i].serverArray, this.arr[j].serverArray);
                    if (v) {
                        throw {
                            code: CODE.JIAOJI,
                            data: `${this.arr[i].url}下${v}用了多次了吧`
                        }
                    }
                }
            }
        }
    }

    private lack() {
        for (let v of this.arr) {
            const noUid = !v.uidArray || Array.isArray(v.uidArray) && !v.uidArray.length;
            const noReg = !v.regionArray || Array.isArray(v.regionArray) && !v.regionArray.length;
            if (noReg && noUid && !v.default) {
                throw {
                    code: CODE.NO_UID_REGION,
                    data: v
                }
            }
        }
    }
}

export {Methods, Verify};
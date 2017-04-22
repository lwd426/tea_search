import { CONTENT, Meta, level, MataS } from './if';
import { Methods, Verify } from './check';

import { four } from './four';
const defaultUpstream = "defaultUpstream";
const geoip_city = `/etc/maxmind-city.mmdb`;
const geoip_subdivisions = `/etc/maxmind-subdivisions.mmdb`;
let allServers = [];

let needDefault = false;
class Upstream {//default
    metaData: Meta;
    upStreamName: string;
    type: string = 'url';
    index: number = 0;

    constructor(meta: Meta) {
        this.metaData = meta;
        this.metaData.serverArray = allServers;//先这么写吧
        this.init();
    }

    init() {
        this.upStreamName = this.getUpstreamName();
    }

    doit(): CONTENT {
        let location = needDefault ? this.getLocation() : '';
        let upstreams = this.getUpstream();
        return {
            location: location,
            upstreams: upstreams
        }
    }

    getLocation() {
        let url = this.metaData.url || '/';
        let upStreamName = this.upStreamName;
        return `
        location ${url} { 
                    proxy_pass http://${upStreamName}; 
        }
        `;
    }

    getUpstreamName() {
        return this.metaData.url == "/" ? defaultUpstream : this.type + "_" + this.metaData.serverArray[this.index].replace(/\./g,'_').replace(/\:/g,'_');
    }

    getUpstream(): string {
        let n = this.upStreamName;
        let s = '';
        this.metaData.serverArray.forEach(ip => {

            s += `
                    server ${ip};
               `;
        });
        return `
                upstream ${n} { 
                     ip_hash;
                      ${s}
                }
                `;
    }
}
//如果uid或者region有效，则生成一个upstream group, 对于哪种不需要生成group的，还是使用另外一个函数吧


function array2one(arr) {
    let arr2 = [];
    for (let v of arr) {
        if (Array.isArray(v.urlArray) && v.urlArray.length) {
            v.urlArray.forEach(item => {
                arr2.push((<any>Object).assign({}, v, {url: item || '/'}));
            });
        }
    }
    arr2.forEach(item => {//如果数组是[],就干脆干掉
        if (item.default) {
            delete item.regionArray;
            delete item.uidArray;
        }
        for (let i in item) {//干掉空数组
            if (Array.isArray(item[i]) && !item[i].length) {
                if (item.default) {

                } else {
                    delete item[i];
                }

            }
        }
        delete item.urlArray;//
    });
    return arr2;
}

function nginx(arr: any[], domain = 'test.m.le.com', port = '80') {
    needDefault = true;
    //let domain = 'test.m.le.com';//todo
    //先加上开始
    arr.forEach(item => {
        for (let i = 0; i < item.serverArray.length; i++) {
            let vs = item.serverArray[i].split('.');
            let v3 = vs[3];
            vs[3] = '188';
            item.serverArray[i] = vs.join(".") + ":9" + v3;
        }
    });
    //先加上结束


    arr = array2one(arr);
    allServerHandler(arr);
    let verf = new Verify(arr);
    let re = verf.check();
    if (re.code != 0) {
        console.log(re);
        return re;
    }
    // arr = array2one(arr);
    arr.forEach(item => {
        if (item.url == '/' && !item.default) {
            needDefault = false;
        }
    });
    let geo = geoIp(arr);
    let wjgz = wanjianguizong(arr);
    /*const res = arr.map(item => {
     delete item.urlArray;
     if (item.uidArray && item.regionArray) {

     return new three(item, allServers).doit();
     }
     return item.uidArray || item.regionArray ? new UpstreamGroup(item, allServers).doit() : new Upstream(item).doit();
     }); */
    const res = wjgz.map(item => {
        return item.servers ? new four(item, allServers).doit() : new Upstream(item).doit();
    });

    let content = `${geo}`;
    let groups = '';
    let upstreams = '';
    let location = '';
    for (let i of res) {
        groups += i.group || "";
        upstreams += i.upstreams || "";
        location += i.location || "";
    }
    content += upstreams;
    content += groups;
    content += `
    server {
        listen  ${port};
        server_name ${domain};
        ${location}
    }
    `;
    // content += location;

    console.log(content);
    re.content = content.replace(/\n/g,' ');
    return re;
}
function geoIp(arr) {

    let flag = false;
    for (let v of arr) {
        flag = flag || !!v.regionArray;
    }
    if (!flag) {
        return '';
    }
    let geoLevel = level;
    let geoip_ = eval('geoip_' + geoLevel);


    let geo1p2 = `
           #使用geoip2 通过ip获取位置信息
           geoip2 ${geoip_} {
            $geoip2_data_${geoLevel}_name default=Beijing ${geoLevel} names en;
           }`;
    return geo1p2;

}

function allServerHandler(arr) {
    for (let v of arr) {
        if (v.default) {
            allServers = [].concat(v.serverArray);
        }
    }
    for (let v of arr) {
        if (v.default) {
            continue;
        }
        for (let k of v.serverArray) {
            if (allServers.indexOf(k) == -1) {
                allServers.push(k);
            }
        }
    }
}
export = nginx;

function wanjianguizong(arr) {
    let array = [];
    for (let v of arr) {
        if (v.default) {
            array.push(v);
            continue;
        }
        let o = {url: v.url, servers: []};
        let flag=false;
        //还得处理相同的url归一的问题
        array.forEach(item => {
            if (item.url == v.url) {
                flag=true;
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
        o.servers.sort((a, b) => {
            return a.uids ? -1 : 1;
        });
        !flag&&array.push(o);
    }
    return array;
}
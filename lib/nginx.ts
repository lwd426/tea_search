import {CONTENT,Meta,level} from './if';
import {Methods, Verify} from './check';
import {UpstreamGroup}from './UpstreamGroup';
import {three}from './three';
const defaultUpstream = "defaultUpstream";
const geoip_city = `/etc/maxmind-city.mmdb`;
const geoip_subdivisions = `/etc/maxmind-subdivisions.mmdb`;
let allServers=[];

let needDefault = false;
class Upstream {//default
    metaData: Meta;
    upStreamName: string;
    type: string = 'url';
    index: number = 0;

    constructor(meta: Meta) {
        this.metaData = meta;
        this.init();
    }

    init() {
        this.upStreamName = this.getUpstreamName();
    }

    doit(): CONTENT {
        let location = needDefault?this.getLocation():'';
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
                    proxy_pass http://$${upStreamName}; 
        }
        `;
    }

    getUpstreamName() {
        return this.metaData.url == "/" ? defaultUpstream : this.type + "_" + this.metaData.serverArray[this.index];
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
                arr2.push((<any>Object).assign({}, v, {url: item||'/'}));
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
                delete item[i];
            }
        }
        delete item.urlArray;//
    });
    return arr2;
}

function nginx(arr: any[]) {
    needDefault = true;
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
    const res = arr.map(item => {
        delete item.urlArray;
        if (item.uidArray && item.regionArray) {

            return new three(item,allServers).doit();
        }
        return item.uidArray || item.regionArray ? new UpstreamGroup(item,allServers).doit() : new Upstream(item).doit();
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
    content += location;
    console.log(content);
    re.content = content;
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

function allServerHandler(arr){
    for(let v of arr){
        if(v.default){
            allServers=[].concat(v.serverArray);
        }
    }
    for(let v of arr){
        for(let k of v.serverArray){
            if(allServers.indexOf(k)==-1){
                allServers.push(k);
            }
        }
    }
}
export = nginx;
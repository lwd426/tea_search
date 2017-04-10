interface CONTENT {
    location: string,
    group?: string,
    upstreams: string
}
interface Meta {
    url: string,
    uidArray?: string[],
    regionArray?: string [],
    serverArray?: string[],
    default?: boolean
}
const defaultUpstream = "defaultUpstream";
const geoipCity = `/etc/maxmind-city.mmdb`;
class Upstream {
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
        let location = this.getLocation();
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
class UpstreamGroup {
    metaData: Meta;
    groupName: string;
    type: string;
    index: number = 0;
    map;

    constructor(meta: Meta) {
        this.metaData = meta;
        this.init();
    }

    init() {
        if (Array.isArray(this.metaData.regionArray) && this.metaData.regionArray.length) {
            this.type = 'url_region';
        } else if (this.metaData.uidArray.length) {
            this.type = 'url_uid';
        }
        this.groupName = this.getGroupName();
        this.map = Array.isArray(this.metaData.regionArray) && this.metaData.regionArray.length ? this.metaData.regionArray : this.metaData.uidArray;
    }

    doit() {
        let location = this.getLocation();
        let group = this.getGroup();
        let upstreams = this.getUpstream();
        return {
            location: location,
            group: group,
            upstreams: upstreams
        }
    }

    getLocation() {
        let url = this.metaData.url || '/';
        let groupName = this.groupName;
        return `
        location ${url} { 
                    proxy_pass http://$${groupName}; 
        }
        `;
    }

    getGroupName() {
        let name = '';
        let rand = (Math.random() + "").slice(-5);
        name = this.type + "_" + rand;
        return name;
    }

    getGroup(): string {
        let groupName = this.groupName;
        let cookie = "";
        let geo1p2 = `
           #使用geoip2 通过ip获取城市信息
           geoip2 ${geoipCity} {
            $geoip2_data_city_name default=Beijing city names en;
           }`;
        if (this.type == 'url_region') {
            cookie = '$geoip2_data_city_name';
        } else if (this.type == 'url_uid') {
            cookie = '$COOKIE_uid';
            geo1p2 = '';
        }
        let regName = this.getGroupContent();

        return `
        ${geo1p2}
        map ${cookie} $${groupName} {
            ${regName}
           
       } `;
    }

    getGroupContent(): string {
        let arr = this.map;
        let s = `
                #写正则和对应的upstream的name`;
        let keyss: string = '';

        keyss = arr.join("|");
        let name: string = this.getUpstreamName();
        s += `
                ~* "${keyss}" ${name};
            `;
        s += `default ${defaultUpstream};`;// default
        return s;
    }

    //搞到一个个的upstream
    getUpstreams(): string {
        let str: string = '';
        let arr = this.map;
        arr.forEach(item => {
            let r = this.getUpstream(item);
            str += `
            ${r}
            `;
        });
        return str;
    }

    getUpstreamName() {
        return this.groupName + "_" + this.metaData.serverArray[this.index];
    }

    getUpstream(opt = this.metaData.serverArray): string {
        let n = this.getUpstreamName();
        let s = '';
        opt.forEach(ip => {

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

class Verify {
    arr: any[];

    constructor(arr) {
        this.arr = arr;
    }

    check() {
        try {
            this.serverSingle();
            this.url();
            this.hasDefault();
            return {
                code: 0,
                data: ''
            };
        } catch (e) {
            return e;
        }
    }

    hasDefault() {
        let flag = false;
        for (let v of this.arr) {
            flag = !!v.default || flag;
        }
        if (!flag) {
            throw {
                code: 3,
                data: `没有默认的`
            };
        }
    }

    getServers() {
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

    url() {
        for (let v of this.arr) {
            if (!v.url) {
                throw {code: 2, data: "有个没填url"}
            }
        }
    }
}
function array2one(arr) {
    let arr2 = [];
    for (let v of arr) {
        if (Array.isArray(v.url) && v.url.length) {
            v.url.forEach(item => {
                arr2.push((<any>Object).assign({}, v, {url: item}));
            });
        } else if (typeof v.url === "string") {
            arr2.push(v);
        }
    }
    arr2.forEach(item => {
        for (let i in item) {
            if (Array.isArray(item[i]) && !item[i].length) {
                delete item[i];
            }
        }
    });
    return arr2;
}

function nginx(arr: any[]) {
    let verf = new Verify(arr);
    const re = verf.check();
    if (re.code != 0) {
        return;
    }
    arr = array2one(arr);
    const res = arr.map(item => {
        return item.uidArray || item.regionArray ? new UpstreamGroup(item).doit() : new Upstream(item).doit();
    });
    let content = '';
    for (let i of res) {
        content += i.group || "";
        content += i.upstreams || "";
        content += i.location || "";
    }
    console.log(content);
    re.content = content;
    return re;
}


export = nginx;
import {Meta,conf} from './if';
import {Methods} from './check';
export class UpstreamGroup {
    metaData: Meta;
    groupName: string;
    type: string;
    index: number = 0;
    allServers:string[];
    map;

    constructor(meta: Meta,allServers) {
        this.metaData = meta;
        this.allServers=allServers;
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
        let geoLevel = conf.level;
        let geoip_ = conf[eval("'geoip_' + geoLevel")];
        if (this.type == 'url_region') {
            cookie = `$geoip2_data_${geoLevel}_name`;
        } else if (this.type == 'url_uid') {
            cookie = '$COOKIE_uid';
        }
        let regName = this.getGroupContent();

        return `
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
                ~*"${keyss}" ${name};
            `;
        s += `default ${this.getUpstreamName()}_default;`;// default
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
                `+this.getDefault();
    }

    getDefault(){
        let n = this.getUpstreamName();
        let s = '';
        let cha=Methods.differenceSet(this.allServers,this.metaData.serverArray);
        cha.forEach(ip => {

            s += `
                    server ${ip};
               `;
        });
        return `
                upstream ${n}_default { 
                     ip_hash;
                      ${s}
                }
                `;
    }
}
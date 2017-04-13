import {Meta,level} from './if';
import {Methods} from './check';

export class three {
    meta: Meta;
    upstreamName: string;
    type: string = 'url_region_uid';
    allServers:string[];
    index: number = 0;

    constructor(meta: Meta,allServers) {
        this.allServers=allServers;
        this.meta = meta;
    }

    doit() {
        let location = this.location();
        let upstreams = this.getUpstream();
        let group = '';
        return {
            location, upstreams, group
        };
    }

    location(): string {
        let arr = [this.meta.url];
        let s = ``;
        let n = this.getUpstreamName();
        for (let v of arr) {
            let u = this.uidArrayHandler();
            let r = this.regionArrayHandler();
            s += `
            location ${v} {
                ${u}
                ${r}
                #default
                proxy_pass http://$${n}_default;
            }  
            `;
        }
        return s;

    }

    uidArrayHandler() {
        let s = ``;
        if (Array.isArray(this.meta.uidArray) && !this.meta.uidArray.length) {
            return '';
        }
        let n = this.getUpstreamName();
        let uids = this.meta.uidArray.join("|");
        s += `
        if($COOKIE_uid ~* "${uids}"){
            proxy_pass http://$${n};
        }
        `;
        return s;
    }

    regionArrayHandler() {
        let s = ``;
        let n = this.getUpstreamName();
        let uids = this.meta.regionArray.join("|");
        let geoLevel = level;
        s += `
        if($geoip2_data_${geoLevel}_name ~* "${uids}"){
            proxy_pass http://$${n};
        }
        `;
        return s;
    }

    getUpstreamName() {
        if (!this.upstreamName) {
            let rand = (Math.random() + "").slice(-5);
            this.upstreamName = this.type + "_" + rand + "_" + this.meta.serverArray[this.index];
        }
        return this.upstreamName;
    }

    getUpstream(): string {
        let n = this.getUpstreamName();
        let s = '';
        this.meta.serverArray.forEach(ip => {

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
        let cha=Methods.differenceSet(this.allServers,this.meta.serverArray);
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
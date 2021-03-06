import { level, MataS, country_name_country_code_city_code } from './if';
import { Methods } from './check'
var uidname = 'ssouid';
export class ARROW {
    meta: MataS;
    upstreamName: string;
    type: string = 'url_region_uid';
    allServers: string[];
    index: number = 0;

    constructor(meta: MataS, allServers) {
        this.allServers = allServers;
        this.meta = meta;
    }

    doit() {
        let location = this.location();
        let upstreams = this.getUpstreams();
        let group = '';
        return {
            location, upstreams, group
        };
    }

    location(): string {
        let arr = [this.meta.url];
        let s = ``;
        let n = this.getUpstreamName();
        let X_Location = ``;
        for (let v of this.meta.servers) {
            if (v.regions) {
                X_Location = country_name_country_code_city_code;
            }
        }

        for (let v of arr) {
            let u = this.uidsregionsHandler();
            s += `
            location ${v} {
                ${X_Location}
                ${u}
                proxy_pass http://${n}_default;
            }  
            `;
        }
        return s;

    }

    uidsregionsHandler() {
        let r = ``;
        for (let v of this.meta.servers) {
            if (v.uids) {
                let n = this.getOneUpstreamName(v);
                r += `
                if ($COOKIE_${uidname} ~* "${v.uids.join("|")}"){
                    proxy_pass http://${n};
                }`;
            }
            if (v.regions) {
                let n = this.getOneUpstreamName(v);
                r += `
                if ($geoip2_data_${level}_name ~* "${v.regions.join("|")}"){
                    proxy_pass http://${n};
                }`;
            }
        }
        return r;
    }

    getOneUpstreamName(v) {
        if (v.uids) {
            return this.type + "_" + v.uids[0] + "_" + v.servers[0].replace(/\./g, '_').replace(/\:/g, '_');
        }
        if (v.regions) {
            return this.type + "_" + v.regions[0].replace(/\s/g, "") + "_" + v.servers[0].replace(/\./g, '_').replace(/\:/g, '_');
        }

    }

    getUpstreamName() {
        if (!this.upstreamName) {
            let rand = (Math.random() + "").slice(-5);
            this.upstreamName = this.type + "_" + rand + "_";
        }
        return this.upstreamName;
    }

    getUpstreams() {
        let s = ``;
        for (let v of this.meta.servers) {
            let rr = '';
            let n = this.getOneUpstreamName(v);
            let ss = ``;
            for (let ip of v.servers) {
                ss += `
                  server ${ip};
                `;
            }
            rr += `
                upstream ${n} { 
                     ip_hash;
                      ${ss}
                }
                `;
            s += rr;
        }
        return s + this.getDefault();
    }

    getDefault() {
        let n = this.getUpstreamName();
        let s = '';
        let arrd = [];
        for (let v of this.meta.servers) {
            v.servers.forEach(ip => {
                if (arrd.indexOf(ip) == -1) {
                    arrd.push(ip);
                }
            });
        }
        let cha = Methods.differenceSet(this.allServers, arrd);
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
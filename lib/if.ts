export interface CONTENT {
    location: string,
    group?: string,
    upstreams: string
}
export interface Meta {
    url: string,
    urlArray?: string[]
    uidArray?: string[],
    regionArray?: string [],
    serverArray?: string[],
    default?: boolean
}


interface mm {
    uids?: string[],
    regions?: string[]
    servers: string[]
}
export interface MataS {
    url: string,
    servers: mm[]
}
export const level = 'subdivisions';

const defaultUpstream = "defaultUpstream";
const geoip_city = `/etc/maxmind-city.mmdb`;
const geoip_subdivisions = `/etc/maxmind-subdivisions.mmdb`;

export const conf = {
    level, defaultUpstream, geoip_city, geoip_subdivisions
};
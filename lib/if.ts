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
export const level = 'city';

export const country_name_country_code_city_code = `add_header X-Location $geoip2_data_country_name-$geoip2_data_country_code-$geoip2_data_city_name;`;

export const geo1p2DB = `
            geoip2 /etc/GeoLite2-Country.mmdb {
                $geoip2_data_country_code default=CN source=$remote_addr country iso_code;
                $geoip2_data_country_name default=China country names en;
            }
            geoip2 /etc/GeoLite2-City.mmdb {
                $geoip2_data_city_name default=Beijing names en;
            }
           `;
import 'whatwg-fetch';
const HOST = require('../../config').HOST;

const virtualhost_url = HOST + '/virtualhost/getbyname/';
const data_traffic_url = 'http://10.100.54.188:8006/db/functions/get_statistic_uv';
const data_conversion_url = 'http://10.100.54.188:8006/db/functions/get_statistic_action';

const mainpage_all_strategies_url = 'http://10.100.54.188:8006/db/functions/get_all_strategies';

module.exports = {
    getVirtualHostByname : async (name) => {
        /*fetch(virtualhost_url + name)
        .then((res) => {
            res.json()
        }).then((json) => {
            console.log(json);
        }).catch((e) => {
    
        })*/
        try {
            let response = await fetch(virtualhost_url + name,{
                method: 'GET',
            });
            let data = await response.json();
            return data;
        } catch(e) {
            console.log("error", e);
        }
    },
    getTrafficDataByStragety : async (stragetys, start, end) => {
        try{
            let response = await fetch(data_traffic_url,{
                method: 'POST',
                headers: {
                    "X-Parse-Application-Id": "gatedLaunch",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "start": start,
                    "end": end,
                    "gls": stragetys
                })
            });
            let data = await response.json();
            return data;
        }catch(e){
            console.log('error', e)
        }
    },
    getConversionDataByStragety : async (stragetys, start, end) => {
        try {
            let response = await fetch(data_conversion_url,{
                method: 'POST',
                headers: {
                    "X-Parse-Application-Id": "gatedLaunch",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    "start": start,
                    "end": end,
                    "gls": stragetys
                })
            });
            let data = await response.json();
            return data;
        } catch(e) {
            console.log("error", e);
        }
    },
    getAllStrategies : async (slbid) => {
        try {
            let response = await fetch(mainpage_all_strategies_url,{
                method: 'POST',
                headers: {
                    "X-Parse-Application-Id": "gatedLaunch",
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                // body: JSON.stringify({
                //     "slbids": ["iUnU5Tij8P"]
                // })
            });
            let data = await response.json();
            return data;
        } catch(e) {
            console.log("error", e);
        }
    }
}

/*fetch('http://10.118.31.22:8081' + '/v2/virtualhost/getbyname/' + slbDomain,{
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "SlbAccount": "le-test"
    }
}).then((res) => {
    return res.json()
})


try {
  let response = await fetch('http://10.118.31.22:8081' + '/v2/virtualhost/getbyname/' + slbDomain);
  let data = response.json();
  console.log(data);
} catch(e) {
  console.log("error", e);
}*/
// 注：这段代码如果想运行，外面需要包一个 async function
/*fetch('http://10.100.54.188:8001/db/functions/get_statistic_uv',{
    method: 'POST',
    headers: {
        "X-Parse-Application-Id": "agent",
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
    },
    body: {
        "start": "2017-03-05",
        "end": "2017-03-05",
        "gls": "100001"
    }
}).then((res) => {
    console.log(res.json().data)
    //return res.json()
})*/

/*try {
    let response = await fetch('http://10.100.54.188:8001/db/functions/get_statistic_uv',{
        method: 'POST',
        headers: {
            "X-Parse-Application-Id": "agent",
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json"
        },
        body: {
            "start": "2017-03-05",
            "end": "2017-03-05",
            "gls": "100001"
        }
    });
    let data = response.json();
    console.log(data);
} catch(e) {
    console.log("error", e);
}*/
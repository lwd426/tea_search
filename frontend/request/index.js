import 'whatwg-fetch';
const HOST = require('../../config').HOST;

const virtualhost_url = HOST + '/virtualhost/getbyname/';
const data_all_url = 'http://10.100.54.188:8001/db/functions/get_statistic_action';

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
    getDateAll : async (projectname, start, end) => {
        try {
            let response = await fetch(data_all_url,{
                method: 'POST',
                headers: {
                    "X-Parse-Application-Id": "agent",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json"
                },
                body: {
                    "start": start,
                    "end": end,
                }
            });
            let data = await response.json();
            return data;
        } catch(e) {
            console.log("error", e);
        }
    },
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
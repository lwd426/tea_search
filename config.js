module.exports = {
	DB: {
		url: 'http://10.100.54.188:8006/db/',
        post: {
            'X-Parse-Application-Id': 'gatedLaunch',
            'Content-Type': 'application/json'
        },
        get: {
            'X-Parse-Application-Id': 'gatedLaunch'
        },
        timeout: 5
	}
	, VH: {
	    url: 'http://10.118.31.22:8081/v2/virtualhost/',
	    headers: {
            "Content-Type": "application/json",
            "SlbAccount": "le-test"
        }
    },
    CHARTS: {
        url: 'http://10.100.54.188:8006/db/functions/',
        headers: {
            "X-Parse-Application-Id": "gatedLaunch",
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
    }
    , HOST: `${process.env.API_HOST}`
	,PORT: 3000

}

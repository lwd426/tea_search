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
	, HOST: 'http://localhost:3000'
	,PORT: 3000

}

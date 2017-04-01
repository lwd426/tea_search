import 'whatwg-fetch'

module.exports = {
    getData: (url, callback) => {
        // 注意这个函数也接收了 getState() 方法
        // 它让你选择接下来 dispatch 什么
        return dispatch => {
            return fetch(url)
                .then((res) => {
                    return res.json()
                }).then((json) => {
                    if (callback) callback(null, json);
                }).catch((e) => {
                    if (callback) callback(e.message);
                })
        }
    },
    postData: (url, data, callback) => {
        return dispatch => {
            return fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((res) => {
                return res.json()
            }).then((json) => {
                if (callback) callback(null, json);
            }).catch((e) => {
                if (callback) callback(e.message);
            })
        }
    },
    deleteData: (url, data, callback) => {
        return dispatch => {

            return fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((res) => {
                return res.json()
            }).then((json) => {
                if (callback) callback(null, json);
            }).catch((e) => {
                if (callback) callback(e.message);
            })
        }
    },
    updateData: (url, where, data, callback) => {
        return dispatch => {

            return fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    where: where,
                    data:da
                })
            }).then((res) => {
                return res.json()
            }).then((json) => {
                if (callback) callback(null, json);
            }).catch((e) => {
                if (callback) callback(e.message);
            })
        }
    }
}


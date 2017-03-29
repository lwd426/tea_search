import * as TYPES from '../constants'
import 'whatwg-fetch'
const menu_url = 'http://localhost:3000/menu'

// export const refreshData = () => {
//     return {
//         type: REFRESHDATA
//     }
// }

export const getMenuListSuccess = (menulist) => {
    return {
        type: TYPES.GET_MENUDATA_SUCCESS,
        menulist
    }
}

// 这里的方法返回一个函数进行异步操作
export function getMenulist() {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(getData('getMenuList'))
    }
}

// 这里的方法返回一个函数进行异步操作
export function getData(type) {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return dispatch => {
        return fetch(menu_url)
            .then((res) => {
            return res.json()
        }).then((json) => {
            if(type === 'getMenuList'){
                dispatch(getMenuListSuccess(json.data.results))
            }else if(type === 'saveMenu'){
                dispatch(saveMenuSuccess(json.data.results))
            }else if(type==='deleteMenu'){
                dispatch(deleteMenuSuccess(json.data.results))
            }
        }).catch((e) => { console.log(e.message) })
    }
}

export function changeShowWinType(wintype) {
    return {
        type: TYPES.SHOW_WIN_TYPE,
        wintype: wintype
    }
}

export function addTestGroup(){
    return  {
        type: TYPES.ADD_TEST_GROUP
    }
}

export function cancelAddTestGroup(){
    return  {
        type: TYPES.CANCEL_ADD_TEST_GROUP
    }
}


function postData(data) {
    return dispatch => {
        return fetch(menu_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then((res) => {
                console.log(res.status);
                return res.json()
            }).then((json) => {
                dispatch(getData('saveMenu'))
            }).catch((e) => { console.log(e.message) })
    }
}

/**
 * 新增测试组
 * @param name
 * @returns {function(*, *)}
 */
export function saveMenu(name) {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(postData({name}))
    }
}

export const saveMenuSuccess = (menulist) => {
    return {
        type: TYPES.SAVE_MENU_SUCCESS,
        menulist
    }
}

export const deleteMenuSuccess = (menulist) => {
    return {
        type: TYPES.DELETE_MENU_SUCCESS,
        menulist
    }
}

function deleteData(data) {
    return dispatch => {
        return fetch(menu_url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then((res) => {
            console.log(res.status);
            return res.json()
        }).then((json) => {
            dispatch(getData('deleteMenu'))
        }).catch((e) => { console.log(e.message) })
    }
}

/**
 * 删除测试组
 * @param name
 * @returns {function(*, *)}
 */
export function deleteTestGroup(id) {
    return (dispatch, getState) => {
        return dispatch(deleteData({id: id}))
    }
}






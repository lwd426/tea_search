import * as TYPES from './constants'
import fetch from '../../fetch'
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
        return dispatch(fetch.getData(menu_url,function(err, result){
            if(!err)  getMenuListSuccess([])
            dispatch(getMenuListSuccess(result.data.results))
        }))
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


/**
 * 新增测试组
 * @param name
 * @returns {function(*, *)}
 */
export function saveMenu(name) {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        // return dispatch(postData({name}))
        return dispatch(fetch.postData(menu_url,{name}, function(err, result){
            if(!err)  postData([])
            dispatch(fetch.getData(menu_url,function(err, result){
                if(!err)  getMenuListSuccess([])
                dispatch(getMenuListSuccess(result.data.results))
            }))
        }))
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

// function deleteData(data) {
//     return dispatch => {
//         return fetch(menu_url, {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         }).then((res) => {
//             console.log(res.status);
//             return res.json()
//         }).then((json) => {
//             dispatch(fetch.getData(menu_url,function(err, result){
//                 if(!err)  deleteMenuSuccess([])
//                 dispatch(deleteMenuSuccess(result.data.results))
//             }))
//         }).catch((e) => { console.log(e.message) })
//     }
// }

/**
 * 删除测试组
 * @param name
 * @returns {function(*, *)}
 */
export function deleteTestGroup(id) {
    return (dispatch, getState) => {
        return dispatch(deleteData({id: id}))
        return dispatch(fetch.deleteData(menu_url,{id: id}, function(err, result){
            if(!err)  deleteMenuSuccess([])
            dispatch(fetch.getData(menu_url,function(err, result){
                if(!err)  getMenuListSuccess([])
                dispatch(getMenuListSuccess(result.data.results))
            }))
        }))
    }

}






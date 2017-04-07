import * as TYPES from './constants'
import fetch from '../../fetch'
const slb_list_url = '/slb'


/**
 * 获取slb列表
 * @returns {function(*, *)}
 */
export function getMenulist() {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetch.getData(slb_list_url,function(err, result){
            if(!err)  getMenuListSuccess([])
            dispatch(getMenuListSuccess(result.data))
        }))
    }
}

/**
 * 删除测试组
 * @param name
 * @returns {function(*, *)}
 */
export function deleteTestGroup(id) {
    return (dispatch, getState) => {
        return dispatch(fetch.deleteData(slb_list_url,{id: id}, function(err, result){
            if(!err)  deleteMenuSuccess([])
            dispatch(fetch.getData(slb_list_url,function(err, result){
                if(!err)  getMenuListSuccess([])
                dispatch(getMenuListSuccess(result.data))
            }))
        }))
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
        return dispatch(fetch.postData(slb_list_url,{name}, function(err, result){
            if(!err)  postData([])
            dispatch(fetch.getData(slb_list_url,function(err, result){
                if(!err)  getMenuListSuccess([])
                dispatch(getMenuListSuccess(result.data))
            }))
        }))
    }
}

export function changeSlb(slbid){
    return {
        type: TYPES.CHANGE_SLB,
        slbid: slbid
    }
}

export function changeShowWinType(slbid, wintype) {
    return {
        type: TYPES.SHOW_WIN_TYPE,
        wintype,
        slbid
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

export const getMenuListSuccess = (menulist) => {
    return {
        type: TYPES.GET_MENUDATA_SUCCESS,
        menulist
    }
}







import * as TYPES from './constants'
import fetch from '../../fetch'
const slb_list_url = 'http://localhost:3000/slb'


/*export function updateMenu(name) {
    return (dispatch, getState) => {
        return dispatch(fetch.postData(slb_list_url,{name}, function(err, result){
            if(!err)  postData([]);
            dispatch(fetch.getData(slb_list_url,function(err, result){
                console.log(result.data.results);
                if(!err)  getMenuListSuccess([])
                dispatch(getMenuListSuccess(result.data.results))
            }))
        }))
    }
}*/

export function updateSLB(objectId, slbDomain) {
    return (dispatch, getState) => {
        return dispatch(fetch.updateData(slb_list_url,{objectId: 'I4WN52Sb7j'}, {slbDomain: slbDomain}, function(err, result){
            console.log(err)
            if(!err){
                return false;
            }
            console.log(result)
            //dispatch(getMenuListSuccess(result.data.results))
        }))
    }
}

export const getMenuListSuccess = (menulist) => {
    return {
        type: TYPES.GET_MENUDATA_SUCCESS,
        menulist
    }
}

/**
 * 获取demo
 * @returns {function(*, *)}

export function getMenulist() {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetch.getData(slb_list_url,function(err, result){
            if(!err)  getMenuListSuccess([])
            dispatch(getMenuListSuccess(result.data.results))
        }))
    }
}
 */

/**
 * 删除demo
 * @param name
 * @returns {function(*, *)}

export function deleteTestGroup(id) {
    return (dispatch, getState) => {
        return dispatch(deleteData({id: id}))
        return dispatch(fetch.deleteData(slb_list_url,{id: id}, function(err, result){
            if(!err)  deleteMenuSuccess([])
            dispatch(fetch.getData(slb_list_url,function(err, result){
                if(!err)  getMenuListSuccess([])
                dispatch(getMenuListSuccess(result.data.results))
            }))
        }))
    }

}
*/
/**
 * 新增demo
 * @param name
 * @returns {function(*, *)}

export function saveMenu(name) {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetch.postData(slb_list_url,{name}, function(err, result){
            if(!err)  postData([])
            dispatch(fetch.getData(slb_list_url,function(err, result){
                if(!err)  getMenuListSuccess([])
                dispatch(getMenuListSuccess(result.data.results))
            }))
        }))
    }
}
 */
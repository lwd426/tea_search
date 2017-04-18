import * as TYPES from './constants'
import fetch from '../../utils/fetch'
import * as menuActions from '../menu/actions'
const HOST = require('../../../config').HOST;
const slb_list_url = HOST + '/slb'
import utilscomps from '../../components/utilscomps'


export function setAddSLBModalStatus(status) {
    return {
        type: TYPES.SHOW_ADD_SLB_MODAL,
        status
    }
}

export function addSlb(name, domain){
    return (dispatch, getState) => {
        return dispatch(fetch.postData(slb_list_url,{name, domain}, function(err, result){
            if(err) utilscomps.showNotification('erroe', '失败', '添加失败，请重试' );
            dispatch(setAddSLBModalStatus(false))
            utilscomps.showNotification('success', '新建成功', '测试项' + name + '已经新建成功！' );
            return dispatch(menuActions.getMenulist())
            // return dispatch(fetch.getData(testgroup_url+ '?slbid='+group.slbid,function(err, result){
            //     if(err)  return dispatch(getTestGroupListSuccess([]))
            //     return dispatch(getTestGroupListSuccess(result.data))
            // }))
        }))
    }
}

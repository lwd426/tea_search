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

export function setAddServerModalStatus(status) {
    return {
        type: TYPES.SHOW_ADD_SERVER_MODAL,
        status
    }
}

export function setAddTgModalStatus(status) {
    return {
        type: TYPES.SHOW_ADD_TG_MODAL,
        status
    }
}

export function vertifyDomainId(domainName) {
    return (dispatch, getState) => {
        if(!domainName) return dispatch(validateDomainResult('error','domain', '请填写分流策略名称'));
        return dispatch(fetch.getData(slb_list_url + '/vertifyDomianId?domainName='+domainName, function(err, result){
            if(err || result.status ==='failure') {
                return dispatch(validateDomainResult('error','domain', result.data, {}));
            }else{
                return dispatch(validateDomainResult('success','domain', '验证通过！域名ID为：' + result.data + '请点击确定按钮保存', {'domainId':result.data}));
            }
        }))
    }
}

export function validateDomainResult(status, keyval, infoval,data) {
    return {
        type: TYPES.VALIDATE_DOMAIN_RESULT,
        status: status,
        key: keyval,
        info: infoval,
        data
    }
}

export function addSlb(name, domain, callbackfunc){
    return (dispatch, getState) => {
        if(!name) return dispatch(validateDomainResult('error','name', '请填写测试项目名称',{name, domain}));
        if(!domain) return dispatch(validateDomainResult('error','domain', '请填写域名',{name, domain}));
        return dispatch(fetch.getData(slb_list_url + '/vertifyDomianId?domainName='+domain, function(err, result){
            if(err || result.status ==='failure') {
                return dispatch(validateDomainResult('error','domain', result.data, {}));
            }else{
                var domainId = result.data;
                return dispatch(fetch.postData(slb_list_url,{name, domain, domainId}, function(err, result){
                    if(err || result.status ==='failure') {
                        utilscomps.showNotification('error', '失败', '添加失败，失败原因：'+result.data );
                    }else{
                        dispatch(validateDomainResult('success','domain', '验证通过！域名ID为：' + result.data + '请点击确定按钮保存', {'domainId':domainId}));
                        dispatch(setAddSLBModalStatus(false))
                        var slb = result.data;
                        utilscomps.showNotification('success', '新建成功', '测试项' + name + '已经新建成功！域名ID为 '+ slb.domainId , 2);
                        if(callbackfunc) callbackfunc();
                        return dispatch(menuActions.getMenulist())
                    }
                }))
            }
        }))

    }
}

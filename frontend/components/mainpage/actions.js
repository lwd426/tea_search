import * as TYPES from './constants';
import fetch from '../../utils/fetch';
const HOST = require('../../../config').HOST;
import request from '../../request';

const slb_list_url = HOST + '/slb'
const testgroup_url = HOST + '/testgroup';
const stragety_url = HOST + '/stragety';
const menuActions = require('../../layout/menu/actions')

/**
 * 获取slb列表
 * @returns {function(*, *)}
 */
export function getMenulist() {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(slb_list_url,function(err, result){
            if(!err)  getMenuListSuccess([])
            dispatch(getMenuListSuccess(result.data));
        }))
    }
}
function getMenuListSuccess(menulist){
    return {
        type: TYPES.GET_MENUDATA_SUCCESS,
        menulist
    }
}


/**
 * 获取测试项目列表
 * @returns {function(*, *)}
 */
export function getTestGroupList() {
    return (dispatch, getState) => {
        return dispatch(fetch.getData(testgroup_url,function(err, result){
            if(err)  return dispatch(getTestGroupListSuccess([]))
            return dispatch(getTestGroupListSuccess(result.data))
        }))
    }
}
function getTestGroupListSuccess(list) {
    return {
        type: TYPES.GET_TESTGROUP_SUCCESS,
        testgrouplist: list,
    }
}



//获取策略...


export function changeContentDisplay(one_display,two_display,key){
    key = (key ? key : '')
    return {
        type:TYPES.CONTENT_DISPLAY,
        content_one_display: one_display, 
        content_two_display: two_display,
        content_two_key: key,
    }
}

export function changeProjectValue(array){
    return{
        type:TYPES.PROJECT_VALUE,
        stragety: array
    }
}

export function changeDatePicker(dateStrings){
    return{
        type:TYPES.DATE_PICKER,
        date_picker: dateStrings
    }
}
export function changeConversionDatePicker(dateStrings){
    return{
        type: 'CONVERSIONDATEPICKER',
        conversion_date_picker: dateStrings
    }
}

export function switchContentShow(main_display, card_display, strageties, currentCasVal) {
    return (dispatch, getState) => {
        if(!currentCasVal || currentCasVal.length ===0) dispatch(menuActions.changeShowWinType( currentCasVal[0] || 0, ''))
        return dispatch(switchContentShowSuccess(main_display, card_display, strageties,currentCasVal))
    }
}

export function switchContentShowSuccess(main_display, card_display, strageties, currentCasVal){
    return{
        type:TYPES.MAIN_CONTAINER_DISPLAY,
        main_container_display: main_display,
        card_container_display: card_display,
        strageties: strageties,
        currentCasVal: currentCasVal
    }
}

export function switchTable(key){
    return{
        type:TYPES.MAIN_CARD_KEY,
        main_card_key: key
    }
}

export function changeCascader(arr){
    return{
        type:TYPES.CASVAL,
        casVal: arr[0]
    }
}

export function setCascaderOptionstwo(strageties_arr, startTime, endTime){
    return async (dispatch,getstate) => {
        //debugger
        let res = await request.getConversionDataByStragety(strageties_arr, startTime, endTime);
        let responseData = res.result.data;
        console.log(responseData);
        if(responseData == {}){
            return
        }
        let strageties = Object.entries(responseData);
        let options_two = [];
        if(strageties.length > 0){
            for(let key in strageties[0][1]){
                options_two.push({
                    value: key,
                    label: key
                })
            }
            return dispatch({
                type:TYPES.OPTIONS,
                options_two: options_two
            })
        }else{
            options_two.push({
                value: '',
                label: ''
            })
            return dispatch({
                type:TYPES.OPTIONS,
                options_two: options_two
            })
        }
        
    }
}
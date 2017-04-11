import * as TYPES from './constants';

/**
 * 进入编辑策略页面
 * @returns {{type}}
 */
export function xxx(stragety) {
    return {
        type: TYPES.EDIT_STRAGETY_INFO,
        stragety: stragety
    }
}

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
import * as TYPES from './constants';
import fetch from '../../fetch'

/**
 * 进入编辑策略页面
 * @returns {{type}}
 */
export function edit_stragety(stragety) {
    return {
        type: TYPES.EDIT_STRAGETY_INFO,
        stragety: stragety
    }
}

/**
 * 返回到项目组
 * @returns {{type, stragety: *}}
 */
export function goback() {
    return {
        type: TYPES.GOBACK_TO_TESTINFOGROUP
    }
}


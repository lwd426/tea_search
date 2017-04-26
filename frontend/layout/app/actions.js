import * as TYPES from './constants'
import * as contentActions from '../content/actions'

//导出加一的方法e
export function mini_menu() {
    return {
        type: TYPES.MINI_MENU
    }
}

export function setAddSLBModalStatus(status) {
    return (dispatch, getState) => {
        return dispatch(contentActions.setAddSLBModalStatus(status))
    }
}
//导出减一的方法
export function max_menu() {
    return {
        type: TYPES.MAX_MENU
    }
}

export function changeSettingBtn() {
    return {
        type: TYPES.CHANGE_SETTING_BTN
    }
}

// export function toolbar(type, data) {
//     return {
//         type: TYPES.TOOLBAR,
//         data,
//         type
//     }
// }
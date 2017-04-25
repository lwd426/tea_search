//处理数字增加的reducer
import * as TYPES from './constants'

let reducer = (state={mode:'inline', showSlbModal:false ,collapsed: true},action)=>{
    switch(action.type){
        case TYPES.MINI_MENU:
            return Object.assign({}, state, { mode:'vertical',collapsed: true})
            break
        case TYPES.MAX_MENU:
            return Object.assign({}, state, { mode:'inline',collapsed: false})
            break
        case TYPES.SHOW_ADD_SLB_MODAL:
            return Object.assign({}, state, { showSlbModal: action.status})
            break
        case TYPES.CHANGE_SETTING_BTN:
            return Object.assign({}, state, { collapsed: !state.collapsed})
            break
        default:
            return state
    }
}

export default reducer
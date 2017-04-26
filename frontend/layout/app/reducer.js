//处理数字增加的reducer
import * as TYPES from './constants'
const initialState = {
    mode:'inline'
    , showSlbModal:false
    ,collapsed: true
    // ,toolbarType: 'mainpage_main'
    // ,toolbarData: {
    //     wintype : 'mainpage',
    //     card_container_display: 'none',
    //     main_container_display: 'block'
    // }
}

let reducer = (state=initialState,action)=>{
    switch(action.type){
        case TYPES.MINI_MENU:
            return Object.assign({}, state, { collapsed: true})
            break
        case TYPES.MAX_MENU:
            return Object.assign({}, state, {collapsed: false})
            break
        case TYPES.SHOW_ADD_SLB_MODAL:
            return Object.assign({}, state, { showSlbModal: action.status})
            break
        case TYPES.CHANGE_SETTING_BTN:
            return Object.assign({}, state, { collapsed: !state.collapsed})
            break
        // case TYPES.TOOLBAR:
        //     return Object.assign({}, state, { toolbarType: action.type, toolbarData: action.data})
        //     break
        default:
            return state
    }
}

export default reducer
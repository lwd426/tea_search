//处理数字增加的reducer
import * as TYPES from './constants'

let reducer = (state={wintype: 'mainpage',slbid: '', add: false, menulist: []},action)=>{
    switch(action.type){
        case TYPES.SHOW_WIN_TYPE:
            return Object.assign({}, state, { wintype: action.wintype, slbid: action.slbid})
            break
        case TYPES.ADD_TEST_GROUP:
            return Object.assign({}, state, { add: true})
            break
        case TYPES.CANCEL_ADD_TEST_GROUP:
            return Object.assign({}, state, { add: false})
            break
        case TYPES.SAVE_MENU_SUCCESS:
            return Object.assign({}, state, { menulist: action.menulist, add: false})
            break
        case TYPES.GET_MENUDATA_SUCCESS:
            return Object.assign({}, state, { menulist: action.menulist})
            break
        case TYPES.DELETE_MENU_SUCCESS:
            return Object.assign({}, state, { menulist: action.menulist})
            break
        // case TYPES.CHANGE_SLB:
        //     return Object.assign({}, state, { slbid: action.slbid})
        //     break
        default:
            return state
    }
}

export default reducer
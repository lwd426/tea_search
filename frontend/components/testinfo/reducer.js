//处理数字增加的reducer
import * as TYPES from './constants'

let reducer = (state={showtype: 'testgroup', stragety: {}},action)=>{
    switch(action.type){
        case TYPES.EDIT_STRAGETY_INFO:
            return Object.assign({}, state, {stragety: action.stragety, showtype: 'stragety'})
            break
        case TYPES.GOBACK_TO_TESTINFOGROUP:
            return Object.assign({}, state, {showtype: 'testgroup'})
            break
        default:
            return state
    }
}

export default reducer
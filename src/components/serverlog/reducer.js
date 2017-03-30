//处理数字增加的reducer
import * as TYPES from './constants'

let reducer = (state={xxx: 'dddd', stragety: {}},action)=>{
    switch(action.type){
        case TYPES.EDIT_STRAGETY_INFO:
            return Object.assign({}, state, {stragety: action.stragety, xxx: 'stragety'})
            break
        default:
            return state
    }
}

export default reducer
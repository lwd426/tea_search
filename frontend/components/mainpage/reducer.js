//处理数字增加的reducer
import * as TYPES from './constants';

let initState = {
    content_one_display: 'block',
    content_two_display: 'none', 
    content_two_key: 1,
    stragety: {}
}

let reducer = (state = initState,action)=>{
    switch(action.type){
        case TYPES.EDIT_STRAGETY_INFO:
            return Object.assign({}, state, {stragety: action.stragety, xxx: 'stragety'})
            break
        case TYPES.CONTENT_DISPLAY:
            return Object.assign({}, state, {
                content_one_display: action.content_one_display, 
                content_two_display: action.content_two_display,
                content_two_key: action.content_two_key ? action.content_two_key : state.content_two_key,
            })
        default:
            return state
    }
}

export default reducer
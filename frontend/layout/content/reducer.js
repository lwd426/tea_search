//处理数字增加的reducer
import * as TYPES from './constants'
import utilscomps from '../../components/utilscomps'
const initalState = {
    showSlbModal: false
}

let reducer = (state = initalState,action)=>{
    switch(action.type){
        case TYPES.SHOW_ADD_SLB_MODAL:
            return Object.assign({}, state, { showSlbModal: action.status})
            break
        default:
            return state
    }
}

export default reducer
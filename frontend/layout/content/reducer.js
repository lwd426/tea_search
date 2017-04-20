//处理数字增加的reducer
import * as TYPES from './constants'
import utilscomps from '../../components/utilscomps'
const initalState = {
    showSlbModal: false
    ,showTgModal: false
    ,showServerModal: false
    , validateDomain: {
        name: {
            status: '',
            info: '请输入名称'
        },
        domain: {
            status: '',
            info: '我们需要验证您填写的域名ID是否正确'
        }
    }
}

let reducer = (state = initalState,action)=>{
    switch(action.type){
        case TYPES.SHOW_ADD_SLB_MODAL:
            return Object.assign({}, state, { showSlbModal: action.status})
            break
        case TYPES.SHOW_ADD_SERVER_MODAL:
            return Object.assign({}, state, { showServerModal: action.status})
            break
        case TYPES.SHOW_ADD_TG_MODAL:
            return Object.assign({}, state, { showTgModal: action.status})
            break
        case TYPES.VALIDATE_DOMAIN_RESULT:
            var key = action.key,
                info = action.info,
                status = action.status,
                validateDomain = state.validateDomain;
                switch(key){
                    case "name": validateDomain.name.status = status;
                        validateDomain.name.info = info;break;
                    case "domain":
                        validateDomain.domain.status = status;
                        validateDomain.domain.info = info;
                        break;
                }
                if(action.status === 'success'){
                    return Object.assign({}, state, {validateDomain: validateDomain, domainId: action.data.domainId})
                }else{
                    return Object.assign({}, state, {validateDomain: validateDomain})
                }
            break
        default:
            return state
    }
}

export default reducer
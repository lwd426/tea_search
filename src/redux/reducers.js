 import { combineReducers } from 'redux'
import app from '../layout/app/reducer'
import menu from '../layout/menu/reducer'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    app,
    menu
})

export default rootReducer

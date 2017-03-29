 import { combineReducers } from 'redux'
import app from '../components/app/reducer'
import menu from '../components/menu/reducer'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    app,
    menu
})

export default rootReducer

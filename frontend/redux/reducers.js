 import { combineReducers } from 'redux'
import app from '../layout/app/reducer'
import menu from '../layout/menu/reducer'
import content from '../components/reducer'
import cont from '../layout/content/reducer'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
    app,
    menu,
    content,
    cont
})

export default rootReducer

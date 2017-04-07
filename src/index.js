import React from 'react'
import { render } from 'react-dom'
import {
	Provider
} from 'react-redux'
import App from './layout/app'
import configureStore from './redux/configureStore'
import DevTool from './redux/DevTool'  // 引入Redux调试工具DevTools

const store = configureStore()

render(
	<Provider store={store}>
		<div>
			<App/>
		</div>

	</Provider>,
	document.getElementById('app')
)

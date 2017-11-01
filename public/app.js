import React from 'react'
import {LocaleProvider} from 'antd'
import * as ruRU from 'antd/lib/locale-provider/ru_RU'
import './app.less';

import FullMainView from './view/main/main'

export default class App extends React.Component{

	render(){
		return (
			<LocaleProvider locale={ruRU}>
				<FullMainView/>
			</LocaleProvider>
		)
	}
}
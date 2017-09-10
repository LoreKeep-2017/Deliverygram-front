import React from 'react'
import {LocaleProvider} from 'antd'
import * as ruRU from 'antd/lib/locale-provider/ru_RU'

import FullButton from './components/button'

export default class App extends React.Component{

	render(){
		console.log(this.props);
		return (
			<LocaleProvider locale={ruRU}>
				<FullButton/>
			</LocaleProvider>
		)
	}
}
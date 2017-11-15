'use strict';
import React from 'react';
import ReactDOM from "react-dom";
import {createStore} from 'redux'
import dataWorking from './reducers/view'
import {Provider} from 'react-redux'

import App from './app';

const store = createStore(dataWorking);

ReactDOM.render(
	<Provider store={store}>
		<App/>
	</Provider>, document.body);

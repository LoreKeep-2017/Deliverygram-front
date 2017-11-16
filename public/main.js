'use strict';
import React from 'react';
import ReactDOM from "react-dom";
import {createStore} from 'redux'
import dataWorking from './reducers/view'
import {Provider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'

import App from './app';

const store = createStore(dataWorking);

let main = document.createElement('main');
main.classList = 'main-content';
document.body.appendChild(main);

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</Provider>, document.getElementsByClassName('main-content')[0]);

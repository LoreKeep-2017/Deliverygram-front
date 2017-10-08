'use strict';

import {
	RECEIVE_ALL_CLIENTS,
	RECEIVE_MESSAGE
} from '../actions/action-types';

const initialState = {
	messages: []
}

const dataWorking = (state = initialState, action) => {

	let newState = Object.assign({}, state);
	switch (action.type) {
		case RECEIVE_ALL_CLIENTS:
			let {clients} = action.payload;
			newState.clients = clients;
			newState.clients = newState.clients.map(item => item);
			return newState;
		case RECEIVE_MESSAGE:
			let {messages} = action.payload;
			newState.messages = messages;
			newState.mesages = newState.messages.map(item=> item);
			return newState;
		default:
			return newState;
	}
};

export default dataWorking

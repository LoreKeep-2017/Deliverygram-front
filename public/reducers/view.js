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
            console.log(clients);
			newState.clients = clients;
            console.log(newState);
			return newState;
		case RECEIVE_MESSAGE:
			let {messages} = action.payload;
			newState.messages = messages;
			return newState;
		default:
			return newState;
	}
};

export default dataWorking

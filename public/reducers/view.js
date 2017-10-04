'use strict';

import {
	DATA_CHANGED,
	DATA_RECEIVE,
	DATA_REQUEST,
	RECIEVE_ALL_CLIENTS
} from '../actions/action-types';

const initialState = {
	messages: []
}

const dataWorking = (state = initialState, action) => {

	let newState = Object.assign({}, state);
	switch (action.type) {
		case DATA_REQUEST:
			return newState;

		case DATA_RECEIVE:{
			let { message } = action.payload;
			let newMessage = {
				message,
				place: 'socket'
			};
			newState.messages.push(newMessage);
			newState.messages = newState.messages.map(item => item);
			return newState;
		}
		case DATA_CHANGED:{
			let {message} = action.payload;
			let newMessage = {
				message,
				place: 'web'
			};
			newState.messages.push(newMessage);
			newState.messages = newState.messages.map(item => item);
			return newState;
		}
		case RECIEVE_ALL_CLIENTS:
			let {clients} = action.payload;
			newState.clients = clients;
			newState.clients = newState.clients.map(item => item);
			return newState
		default:
			return newState;
	}
};

export default dataWorking

'use strict';

import {
	DATA_CHANGED,
	DATA_RECEIVE,
	DATA_REQUEST
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
		default:
			return newState;
	}
};

export default dataWorking

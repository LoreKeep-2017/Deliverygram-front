'use strict';

import {
	ADD_TO_ROOM,
	ROOM_CLOSED,
	SEND_MESSAGE,
	SWITCH_TO_CHAT_FORM,
	SWITCH_TO_START_FORM,
	SWITCH_TO_BUTTON
} from '../actions/action-types';

const initialState = {
	messages: []
}

const dataWorking = (state = initialState, action) => {

	let newState = Object.assign({}, state);
	console.info(action);
	switch (action.type) {
		case SWITCH_TO_BUTTON:
			delete newState.position;
			return newState;
		case SWITCH_TO_START_FORM:
			newState.position = 'startForm';
			return newState;
		case SWITCH_TO_CHAT_FORM:
			let {title, description} = action.payload;
			newState.messages.push({
				place: 'web',
				message: description
			});
			newState.title = title;
			newState.position = 'chatForm';
			return newState;
		case ADD_TO_ROOM: {
			const {data} = action.payload;
			newState.clientId = data.client.id;
			newState.opearatorId = data.operator.id;
			newState.messages = data.messages;
			return newState;
		}
		case SEND_MESSAGE: {
			const data = action.payload;
			newState.messages = data;
			return newState;
		}
		case ROOM_CLOSED:
			newState.position = 'startForm';
			return newState;
		case SWITCH_TO_BUTTON:
			delete newState.position;
		default:
			return newState;
	}
};

export default dataWorking

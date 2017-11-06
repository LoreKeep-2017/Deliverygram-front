'use strict';

import {
	ADD_TO_ROOM,
	ROOM_CLOSED,
	SEND_MESSAGE,
	SWITCH_TO_CHAT_FORM,
	SWITCH_TO_START_FORM,
	SWITCH_TO_BUTTON,
	SEND_CLIENT_MESSAGE, GET_MESSAGES_FROM_STORE, RESTORE_LAST_CHAT
} from '../actions/action-types';

const initialState = {
	messages: [],
	restore:false
}

const dataWorking = (state = initialState, action) => {

	let newState = Object.assign({}, state);
	console.info(action);
	switch (action.type) {
		case SWITCH_TO_BUTTON:
			const {lastPosition} = action.payload;
			delete newState.position;
			delete newState.restore;
			if (lastPosition !== 'restoreChat') {
				newState.lastPosition = lastPosition;
			} else {
				delete newState.lastPosition;
				newState.messages = [];
			}
			return newState;
		case SWITCH_TO_START_FORM:
			newState.position = newState.lastPosition || 'startForm';
			return newState;
		case SWITCH_TO_CHAT_FORM:
			let {title, description, nick} = action.payload;
			newState.title = title;
			newState.description = description;
			newState.nick = nick;
			newState.position = 'chatForm';
			return newState;
		case RESTORE_LAST_CHAT:
			newState.position = 'chatForm';
			newState.restore = true;
			return newState;
		case ADD_TO_ROOM: {
			const {data} = action.payload;
			newState.clientId = data.client.id;
			newState.opearatorId = data.operator.id;
			newState.messages = data.messages;
			return newState;
		}
		case SEND_MESSAGE: {
			const {data} = action.payload;
			newState.messages = data;
			return newState;
		}
		case SEND_CLIENT_MESSAGE:
			newState.messages = newState.messages.map(item => item);
			return newState;
		case ROOM_CLOSED:
			newState.position = 'startForm';
			return newState;
		case GET_MESSAGES_FROM_STORE: {
			const {messages, title} = action.payload;
			newState.messages = messages;
			newState.title = title;
			newState.loaded = true;
			console.log(action.payload, newState);
			return newState;
		}
		default:
			return newState;
	}
};

export default dataWorking

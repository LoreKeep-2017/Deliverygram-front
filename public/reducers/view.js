'use strict';

import {
	ADD_TO_ROOM,
	ROOM_CLOSED,
	SEND_MESSAGE,
	SWITCH_TO_CHAT_FORM,
	SWITCH_TO_BUTTON,
	SEND_CLIENT_MESSAGE,
	GET_MESSAGES_FROM_STORE,
	RESTORE_LAST_CHAT,
	SEND_GREETING_MESSAGE,
	RECEIVE_GREETING_MESSAGE, ASK_NICKNAME, CLOSE_NICKNAME
} from '../actions/action-types';

const initialState = {
	messages: [],
	restore: false,
}

const dataWorking = (state = initialState, action) => {

	let newState = Object.assign({}, state);
	console.info(action);
	switch (action.type) {
		case SWITCH_TO_BUTTON:
			const {lastPosition} = action.payload;
			delete newState.position;
			delete newState.restore;
			delete newState.nickname;
			if (lastPosition !== 'restoreChat') {
				newState.lastPosition = lastPosition;
			} else {
				delete newState.lastPosition;
				newState.messages = [];
			}
			return newState;
		case SWITCH_TO_CHAT_FORM:
			newState.position = 'chatForm';
			delete newState.newMessages;
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
			if (!newState.rid && data[0]){
				newState.rid = data[0].room;
			}
			if (!newState.position) {
				newState.newMessages = newState.newMessages || 0;
				++newState.newMessages;
			}
			newState.messages.unshift(newState.greetingMessage);
			return newState;
		}
		case SEND_CLIENT_MESSAGE:
			newState.messages = newState.messages.map(item => item);
			return newState;
		case GET_MESSAGES_FROM_STORE: {
			const {messages} = action.payload;
			newState.localMessages = messages;
			newState.messages = messages;
			newState.rid = messages[0].room;
			newState.messages.unshift(newState.greetingMessage);
			newState.restore = true;
			console.info(newState);
			return newState;
		}
		case SEND_GREETING_MESSAGE:
			const {
				message
			} = action.payload;
			delete newState.messages;
			newState.messages = [];
			newState.greetingMessage = message;
			newState.messages.push(message);
			newState.showGreeting = true;
			return newState;
		case ASK_NICKNAME:
			newState.nickname = true;
			return newState;
		case CLOSE_NICKNAME:
			delete newState.nickname;
			return newState;
		default:
			return newState;
	}
};

export default dataWorking

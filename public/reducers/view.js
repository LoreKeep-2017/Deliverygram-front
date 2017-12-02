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
	RECEIVE_GREETING_MESSAGE, ASK_NICKNAME, CLOSE_NICKNAME, GET_EXTRA_MESSAGES, SHOW_EMOJIS, HIDE_EMOJIS, IMAGE_UPLOAD,
	REMOVE_IMAGE, MAKE_IMAGE_FULL_SCREEN, REMOVE_IMAGE_FULL_SCREEN
} from '../actions/action-types';
import _ from 'lodash';

const initialState = {
	messages: [],
	restore: false,
	mainRowClass: 'messandger-area messandger-area_appear'
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
			newState.switchToButton = true;
			return newState;
		case SWITCH_TO_CHAT_FORM:
			newState.position = 'chatForm';
			delete newState.newMessages;
			delete newState.switchToButton;
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
			newState.messages = data.messages;
			if (!newState.rid && data.id) {
				newState.rid = data.id;
			}
			if (!newState.position) {
				newState.newMessages = newState.newMessages || 0;
				++newState.newMessages;
			}
			newState.greetingMessage.time = newState.messages[0].time;
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
		case GET_EXTRA_MESSAGES:
			const {
				messages
			} = action.payload;
			newState.messages = _.concat(newState.messages, messages);
			return newState;
		case SHOW_EMOJIS:
			newState.showPicker = true;
			return newState;
		case HIDE_EMOJIS:
			newState.showPicker = false;
			return newState;
		case IMAGE_UPLOAD: {
			const {
				image,
				format,
				name
			} = action.payload;
			newState.images = newState.images || [];
			newState.format = newState.format || [];
			newState.name = newState.name || [];
			newState.activeName = newState.activeName || [];
			newState.images.push(image);
			newState.format.push(format);
			newState.name.push(name);
			newState.activeName.push(newState.name.length - 1);
			delete newState.noImages;
			newState.images = newState.images.map(item => item);
			newState.mainRowClass = 'messandger-area';
			return newState;
		}
		case REMOVE_IMAGE: {
			const {
				position
			} = action.payload;
			let part1 = _.slice(newState.images, 0, position);
			let part2 = _.slice(newState.images, position + 1);
			newState.images = _.concat(part1, part2);
			if (newState.images.length === 0) {
				newState.noImages = true;
			}
			return newState;
		}
		case MAKE_IMAGE_FULL_SCREEN: {
			const {
				src
			} = action.payload;
			newState.src = src;
			return newState;
		}
		case REMOVE_IMAGE_FULL_SCREEN: {
			delete newState.src;
			return newState;
		}
		default:
			return newState;
	}
};

export default dataWorking

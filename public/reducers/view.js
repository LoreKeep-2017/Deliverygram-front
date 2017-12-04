'use strict';

import {
	RECEIVE_ALL_CLIENTS,
	RECEIVE_MESSAGE,
	SEND_MESSAGE,
	ENTER_ROOM,
	CHANGE_ROOM_STATUS,
	CHANGE_WATCHING_MESSAGES_STATUS,
	SELECT_ROOM,
	GET_CHAT_INFO,
	LOGIN_SUCCESS,
	SAVE_LAST_URL,
	CHECK_AUTH_FAILED,
	LOGIN_PENDING,
	LOGIN_FAILED,
	LOGOUT_SUCCESS,
	CHOOSE_NEW_OPERATOR,
	RECEIVE_OPERATORS,
	CANCEL_OPERATOR_CHANGE,
	REDIRECT_DONE,
	REMOVE_SENDED_FLAG,
	UPDATE_INFO,
	SHOW_EMOJIS,
	HIDE_EMOJIS,
	REMOVE_IMAGE,
	IMAGE_UPLOAD,
	MAKE_IMAGE_FULL_SCREEN,
	REMOVE_IMAGE_FULL_SCREEN
} from '../actions/action-types';

const initialState = {
	messages: [],
	newMessages: [],
	loginStatuses: {}
}

const dataWorking = (state = initialState, action) => {
	console.info(action);
	let newState = Object.assign({}, state);
	switch (action.type) {
		case RECEIVE_ALL_CLIENTS:
			let {clients} = action.payload;
			newState.clients = clients;
			return newState;
		case RECEIVE_MESSAGE:
			let {messages} = action.payload;
			console.info(messages);
			if (messages.length > 0) {
				if (messages[0].room !== +newState.selectedRoom) {
					let len = newState.messages[messages[0].room] ? newState.messages[messages[0].room].length : 0;
					newState.newMessages[messages[0].room] = messages.length - len;
				}
				else if (messages[0].room) {
					newState.messages[messages[0].room] = messages;
					delete newState.newMessages[messages[0].room];
				}
			}
			if (messages[0]) {
				let selectRoom = messages[0].room;
				newState.clients.rooms[selectRoom].lastMessage = newState.messages[selectRoom][newState.messages[selectRoom].length - 1].body;
				newState.messages = newState.messages.map(item => item);
			}
			return newState;
		case SEND_MESSAGE: {
			const {
				body,
				room
			} = action.payload;
			let message = {
				author: 'client',
				body: body,
				room: room
			};
			if (!newState.messages[room]) {
				newState.messages[room] = [];
			}
			newState.messages[room].push(message);
			newState.sended = true;
			if (newState.clients.rooms[room]) {
				newState.clients.rooms[room].lastMessage = newState.messages[room][newState.messages[room] - 1];
			}
			return newState;
		}
		case ENTER_ROOM:
			const {
				rid
			} = action.payload;
			delete newState.selectedRoom;
			newState.rid = rid;
			return newState;
		case CHANGE_ROOM_STATUS: {
			const {room} = action.payload;
			if (newState.clients && newState.clients.rooms) {
				delete newState.clients.rooms[room.id];
			}
			if (room.status === newState.activeStatus) {
				newState.clients.rooms[room.id] = room;
			}
			newState.messages = newState.messages.map(item => item);
			return newState;
		}
		case UPDATE_INFO: {
			console.log(action.payload);
			const {
				nickname,
				rid
			} = action.payload;
			newState.clients.rooms[rid].client.nick = nickname;
			return newState;
		}
		case CHANGE_WATCHING_MESSAGES_STATUS: {
			const {status} = action.payload;
			newState.activeStatus = status;
			delete newState.selectedRoom;
			delete newState.rid;
			newState.messages = newState.messages.map(item => item);
			return newState;
		}
		case SELECT_ROOM: {
			const {
				rid
			} = action.payload;
			newState.selectedRoom = rid;
			// if (newState.clients.rooms && newState.clients.rooms[rid]) {
			// 	newState.clients.rooms[rid].lastMessage = newState.messages[rid][newState.messages[rid] - 1];
			// }
			return newState;
		}
		case CHOOSE_NEW_OPERATOR:
			const {
				choose
			} = action.payload;
			newState.chooseOperator = choose;
			newState.redirectFromInfo = false;
			if (!choose) {
				delete newState.rid;
				delete newState.selectedRoom;
				newState.redirectFromInfo = true;
			}
			return newState;
		case CANCEL_OPERATOR_CHANGE:
			delete newState.chooseOperator;
			return newState;
		case RECEIVE_OPERATORS:
			newState.operators = action.payload.operators;
			return newState;
		case LOGIN_SUCCESS:
			const {
				data
			} = action.payload;
			newState.operatorInfo = data;
			newState.loginStatuses.checkedAuth = true;
			delete newState.loginStatuses.signRedirect;
			delete newState.loginStatuses.pending;
			return newState;
		case CHECK_AUTH_FAILED:
		case LOGIN_FAILED:
			newState.loginStatuses.checkedAuth = true;
			newState.loginStatuses.signRedirect = true;
			delete newState.loginStatuses.pending;
			return newState;
		case LOGIN_PENDING:
			newState.loginStatuses.pending = true;
			return newState;
		case SAVE_LAST_URL:
			newState.lastUrl = action.payload.url;
			return newState;
		case LOGOUT_SUCCESS:
			delete newState.loginStatuses.signRedirect;
			delete newState.loginStatuses.pending;
			delete newState.operatorInfo;
			newState.loginStatuses.checkedAuth = true;
			return newState;
		case REDIRECT_DONE:
			delete newState.redirectFromInfo;
			return newState;
		case REMOVE_SENDED_FLAG:
			delete newState.sended;
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

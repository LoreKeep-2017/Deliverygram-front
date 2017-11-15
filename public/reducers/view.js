'use strict';

import {
	RECEIVE_ALL_CLIENTS,
	RECEIVE_MESSAGE,
	SEND_MESSAGE,
	ENTER_ROOM,
	CHANGE_ROOM_STATUS,
	CHANGE_WATCHING_MESSAGES_STATUS,
	SELECT_ROOM, GET_CHAT_INFO, LOGIN_SUCCESS, SAVE_LAST_URL, CHECK_AUTH_FAILED, LOGIN_PENDING, LOGIN_FAILED,
	LOGOUT_SUCCESS, CHOOSE_NEW_OPERATOR, RECEIVE_OPERATORS, CANCEL_OPERATOR_CHANGE, REDIRECT_DONE
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
			newState.messages = newState.messages.map(item => item);
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
			return newState;
		}
		case GET_CHAT_INFO: {
			const {
				getInfo
			} = action.payload;
			newState.getInfo = getInfo;
			newState.redirectFromInfo = false;
			return newState;
		}
		case CHOOSE_NEW_OPERATOR:
			const {
				choose
			} = action.payload;
			newState.chooseOperator = choose;
			newState.redirectFromInfo = false;
			if (!choose){
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
		default:
			return newState;
	}
};

export default dataWorking

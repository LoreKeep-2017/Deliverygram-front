'use strict';

import {
	RECEIVE_ALL_CLIENTS,
	RECEIVE_MESSAGE,
	SEND_MESSAGE,
	ENTER_ROOM,
	CHANGE_ROOM_STATUS,
	CHANGE_WATCHING_MESSAGES_STATUS,
	SELECT_ROOM, GET_CHAT_INFO
} from '../actions/action-types';

const initialState = {
	messages: [],
	newMessages: []
}

const dataWorking = (state = initialState, action) => {

	let newState = Object.assign({}, state);
	switch (action.type) {
		case RECEIVE_ALL_CLIENTS:
			let {clients} = action.payload;
			newState.clients = clients;
			return newState;
		case RECEIVE_MESSAGE:
			let {messages} = action.payload;
			if(messages.length > 0) {
				if (messages[0].room !== newState.selectedRoom) {
					let len = newState.messages[messages[0].room] ? newState.messages[messages[0].room].length : 0
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
			delete newState.clients.rooms[room.id];
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
		case GET_CHAT_INFO:{
			const {
				getInfo
			} = action.payload;
			newState.getInfo = getInfo;
			return newState;
		}

		default:
			return newState;
	}
};

export default dataWorking

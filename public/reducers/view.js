'use strict';

import {
	RECEIVE_ALL_CLIENTS,
	RECEIVE_MESSAGE,
    SEND_MESSAGE,
    ENTER_ROOM,
    CHANGE_ROOM_STATUS
} from '../actions/action-types';

const initialState = {
	messages: []
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
			newState.messages = messages;
			return newState;
        case SEND_MESSAGE:
        {
            const {
                body,
                room
            } = action.payload;
            let message = {
                author: 'client',
                body: body,
                room: room
            };
            newState.messages.push(message);
            return newState;
        }
        case ENTER_ROOM:
            const {
                rid
            } = action.payload;
            newState.rid = rid;
            return newState;
        case CHANGE_ROOM_STATUS:
        {
            const {room} = action.payload;
            delete newState.clients.rooms[room.id];
            newState.clients.rooms[room.id] = room;
            newState.messages = newState.messages.map(item => item);
            return newState;
        }
		default:
			return newState;
	}
};

export default dataWorking

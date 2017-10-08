'use strict';

import {
	RECEIVE_ALL_CLIENTS,
	RECEIVE_MESSAGE,
    SEND_MESSAGE,
    ENTER_ROOM
} from '../actions/action-types';

const initialState = {
	messages: []
}

const dataWorking = (state = initialState, action) => {

	let newState = Object.assign({}, state);
	switch (action.type) {
		case RECEIVE_ALL_CLIENTS:
			let {clients} = action.payload;
            console.log(clients);
			newState.clients = clients;
            console.log(newState);
			return newState;
		case RECEIVE_MESSAGE:
			let {messages} = action.payload;
			newState.messages = messages;
			return newState;
        case SEND_MESSAGE:
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
        case ENTER_ROOM:
            const {
                rid
            } = action.payload;
            newState.rid = rid;
            return newState;
		default:
			return newState;
	}
};

export default dataWorking

'use strict';

import {
	CLOSE_CHAT,
	RECEIVE_ALL_CLIENTS, RECEIVE_MESSAGE,
	SEND_MESSAGE
} from '../actions/action-types';

export const receiveClients = (clients) => ({
	type: RECEIVE_ALL_CLIENTS,
	payload: {clients}
})

export const sendMessage = (message) => ({
	type: SEND_MESSAGE,
	payload: {message}
})

export const closeChat = (room) => ({
	type: CLOSE_CHAT,
	payload: {room}
})

export const receiveMessages = (messages) => ({
	type: RECEIVE_MESSAGE,
	payload: {messages}
})

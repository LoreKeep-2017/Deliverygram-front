'use strict';

import {
	CLOSE_CHAT,
	RECEIVE_ALL_CLIENTS,
	RECEIVE_MESSAGE,
	SEND_MESSAGE,
	ENTER_ROOM,
	CHANGE_ROOM_STATUS, CHANGE_WATCHING_MESSAGES_STATUS
} from '../actions/action-types';

export const receiveClients = (clients) => ({
	type: RECEIVE_ALL_CLIENTS,
	payload: {clients}
})

export const sendMessage = (message, rid) => ({
	type: SEND_MESSAGE,
	payload: {message, rid}
})

export const closeChat = (room) => ({
	type: CLOSE_CHAT,
	payload: {room}
})

export const receiveMessages = (messages) => ({
	type: RECEIVE_MESSAGE,
	payload: {messages}
})

export const enterRoom = (rid) => ({
    type: ENTER_ROOM,
    payload: {rid}
})

export const changeRoomStatus = (room) => ({
    type: CHANGE_ROOM_STATUS,
    payload: {room}
})

export const changeMessagesByStatus = (status) => ({
	type: CHANGE_WATCHING_MESSAGES_STATUS,
	payload: {status}
})

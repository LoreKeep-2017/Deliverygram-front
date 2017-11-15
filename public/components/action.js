'use strict';

import {
	SWITCH_TO_CHAT_FORM,
	ADD_TO_ROOM,
	SEND_MESSAGE,
	SWITCH_TO_BUTTON,
	SEND_CLIENT_MESSAGE,
	ROOM_CLOSED,
	RESTORE_LAST_CHAT,
	GET_MESSAGES_FROM_STORE,
	SEND_GREETING_MESSAGE,
	RECEIVE_GREETING_MESSAGE, ASK_NICKNAME, CLOSE_NICKNAME
} from '../actions/action-types';


export const switchToChatFrom = () => ({
	type: SWITCH_TO_CHAT_FORM
});

export const addToNewRoom = (data) => ({
	type: ADD_TO_ROOM,
	payload: {data}
});

export const messageSend = (data) => ({
	type: SEND_MESSAGE,
	payload: {data}
});

export const roomClosed = (data) => ({
	type: ROOM_CLOSED,
	payload: data
});

export const closeStartForm = (lastPosition) => ({
	type: SWITCH_TO_BUTTON,
	payload: {lastPosition}
});

export const restorePrevChat = () => ({
	type: RESTORE_LAST_CHAT
});

export const sendClientMessage = () => ({
	type: SEND_CLIENT_MESSAGE
});

export const getMessagesFromStore = (messages) => ({
	type: GET_MESSAGES_FROM_STORE,
	payload: {messages}
});

export const sendGreetingMessage = (message) => ({
	type: SEND_GREETING_MESSAGE,
	payload: {message}
});

export const receiveGreetingMessage = () => ({
	type: RECEIVE_GREETING_MESSAGE
})

export const askNickname = () => ({
	type: ASK_NICKNAME
})

export const closeNickname = () => ({
	type: CLOSE_NICKNAME
})

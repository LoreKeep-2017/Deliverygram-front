'use strict';

import {
	SWITCH_TO_START_FORM,
	SWITCH_TO_CHAT_FORM,
	ADD_TO_ROOM,
	SEND_MESSAGE,
	SWITCH_TO_BUTTON, SEND_CLIENT_MESSAGE, ROOM_CLOSED, RESTORE_LAST_CHAT, GET_MESSAGES_FROM_STORE
} from '../actions/action-types';

export const switchToButton = () => ({
	type: SWITCH_TO_BUTTON
})

export const switchToStartForm = () => ({
	type: SWITCH_TO_START_FORM
})

export const switchToChatFrom = (title, description, nick) => ({
	type: SWITCH_TO_CHAT_FORM,
	payload: {title, description, nick}
})

export const addToNewRoom = (data) => ({
	type: ADD_TO_ROOM,
	payload: {data}
})

export const messageSend = (data) => ({
	type: SEND_MESSAGE,
	payload: {data}
})

export const roomClosed = (data) => ({
	type: ROOM_CLOSED,
	payload: data
})

export const closeStartForm = (lastPosition) => ({
	type: SWITCH_TO_BUTTON,
	payload: {lastPosition}
})

export const restorePrevChat = () => ({
	type: RESTORE_LAST_CHAT
})

export const sendClientMessage = () => ({
	type: SEND_CLIENT_MESSAGE
})

export const getMessagesFromStore = (messages, title) => ({
	type: GET_MESSAGES_FROM_STORE,
	payload: {messages, title}
})

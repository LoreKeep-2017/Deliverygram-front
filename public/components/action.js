'use strict';

import {
	SWITCH_TO_START_FORM,
	SWITCH_TO_CHAT_FORM,
	ADD_TO_ROOM,
	SEND_MESSAGE,
	SWITCH_TO_BUTTON
} from '../actions/action-types';

export const switchToButton = () => ({
	type: SWITCH_TO_BUTTON
})

export const switchToStartForm = () => ({
	type: SWITCH_TO_START_FORM
})

export const switchToChatFrom = (title, description) => ({
	type: SWITCH_TO_CHAT_FORM,
	payload: {title, description}
})

export const addToNewRoom = (data) => ({
	type: ADD_TO_ROOM,
	payload: {data}
})

export const messageSend = (data) => ({
	type: SEND_MESSAGE,
	payload: data
})

export const roomClosed = (data) => ({
	type: ROOM_CLOSED,
	payload: data
})

export const closeStartForm = () => ({
	type: SWITCH_TO_BUTTON
})

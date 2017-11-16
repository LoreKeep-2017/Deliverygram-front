'use strict';

import {
	CLOSE_CHAT,
	RECEIVE_ALL_CLIENTS,
	RECEIVE_MESSAGE,
	SEND_MESSAGE,
	ENTER_ROOM,
	CHANGE_ROOM_STATUS,
	CHANGE_WATCHING_MESSAGES_STATUS,
	SELECT_ROOM,
	GET_CHAT_INFO,
	LOGIN_PENDING,
	LOGIN_FAILED,
	LOGIN_SUCCESS,
	SAVE_LAST_URL,
	CHECK_AUTH_FAILED,
	LOGOUT_SUCCESS,
	LOGOUT_FAILED, CHOOSE_NEW_OPERATOR, RECEIVE_OPERATORS, CANCEL_OPERATOR_CHANGE, REDIRECT_DONE, REMOVE_SENDED_FLAG,
	UPDATE_INFO
} from '../actions/action-types';

export const receiveClients = (clients) => ({
	type: RECEIVE_ALL_CLIENTS,
	payload: {clients}
})

export const sendMessage = (message, rid) => ({
	type: SEND_MESSAGE,
	payload: {message, rid}
})

export const closeChat = (rid) => ({
	type: CLOSE_CHAT,
	payload: {rid}
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

export const selectRoom = (rid) => ({
	type: SELECT_ROOM,
	payload: {rid}
})
export const getExtraInfo = (getInfo) => ({
	type: GET_CHAT_INFO,
	payload: {getInfo}
})

export const chooseNewOperator = (choose) => ({
	type: CHOOSE_NEW_OPERATOR,
	payload: {choose}
})

export const cancelOperatorChange = () => ({
	type: CANCEL_OPERATOR_CHANGE
})

export const redirectDone = () => ({
	type: REDIRECT_DONE
})

export const receiveOperators = (operators) => ({
	type: RECEIVE_OPERATORS,
	payload: {operators}
})

export const loginPending = () => ({
	type: LOGIN_PENDING
})

export const loginSuccess = (data) => ({
	type: LOGIN_SUCCESS,
	payload: {data}
})

export const loginFailed = () => ({
	type: LOGIN_FAILED
})

export const saveUrl = (url) => ({
	type: SAVE_LAST_URL,
	payload: {url}
})

export const checkAuthFailed = () => ({
	type: CHECK_AUTH_FAILED
})

export const logoutSuccess = () => ({
	type: LOGOUT_SUCCESS
})

export const logoutFailed = () => ({
	type: LOGOUT_FAILED
})

export const removeSendedFlag = () => ({
	type: REMOVE_SENDED_FLAG
})

export const updateInfo = (body) => ({
	type: UPDATE_INFO,
	payload: body
})

'use strict';
import {
	DATA_CHANGED, DATA_RECEIVE,
	DATA_REQUEST
} from '../actions/action-types';

export const requestData = () => ({
	type: DATA_REQUEST,
	payload: {}
})

export const receiveData = (message) => ({
	type: DATA_RECEIVE,
	payload: {message}
})

export const changedData = (message) => ({
	type: DATA_CHANGED,
	payload: {message}
})

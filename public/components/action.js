'use strict';
import {
	DATA_CHANGED, DATA_RECEIVE,
	DATA_REQUEST
} from '../actions/action-types';

export const requestData = () => ({
	type: DATA_REQUEST,
	payload: {}
})

export const receiveData = () => ({
	type: DATA_RECEIVE,
	payload: {}
})

export const changedData = () => ({
	type: DATA_CHANGED,
	payload: {}
})

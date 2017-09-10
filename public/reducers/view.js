'use strict';

import {
	DATA_CHANGED,
	DATA_RECEIVE,
	DATA_REQUEST
} from '../actions/action-types';


const initialState = {
}

const dataWorking = (state = initialState, action) => {

	let newState = Object.assign({}, state);
	switch (action.type){
		case DATA_REQUEST:
			return newState;

		case DATA_RECEIVE:
			return newState;

		case DATA_CHANGED:
			console.log('data changed');
			return newState;
		default:
			return newState;
	}
};

export default dataWorking

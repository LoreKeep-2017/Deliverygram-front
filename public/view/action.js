'use strict';

import {
	RECIEVE_ALL_CLIENTS
} from '../actions/action-types';

export const recieveClients = (clients) => ({
	action: RECIEVE_ALL_CLIENTS,
	payload: clients
})

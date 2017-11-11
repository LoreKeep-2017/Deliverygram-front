'use strict';

import axios from 'axios'

function getInstance() {
	return axios.create({
		baseURL: 'http://139.59.139.151',
		timeout: 3000,
		headers: {'Content-Type': 'application/json'}
	});
}

export function axiosGet({path}) {
	return getInstance().get(path)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error);
		})
}

export function axiosPost({path, body}) {
	return getInstance().post(path, body)
		.then(response => response.data)
		.catch(error => {
			throw new Error(error);
		})
}

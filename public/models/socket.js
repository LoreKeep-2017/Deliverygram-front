'use strict';

import localforage from 'localforage';

export default class Socket {

	constructor({messageSend, addToNewRoom, roomClosed, message, restore, rid}) {
		this.socket = new WebSocket('ws://139.59.139.151/api/v1/client');
		this.queue = [];

		this.socket.onopen = () => {
			if (!restore) {
				this.socket.send(this.createInitData(message));
			} else {
				this.socket.send(this.createRestoreData(rid))
			}
			this.queue.forEach(item => this.socket.send(item));
		};

		this.socket.onmessage = (message) => {
			let recievedMessage = JSON.parse(message.data)
			if (recievedMessage.code === 200) {
				switch (recievedMessage.action) {
					case 'addToRoom':
						addToNewRoom(recievedMessage.body);
						return;
					case 'sendMessage':
						localforage.setItem('message', recievedMessage.body)
							.then( response =>
								messageSend(recievedMessage.body)
							);
						return;
					case 'roomClosed':
						roomClosed(recievedMessage.body);
						return;
				}
			}
		}
	}

	sendWithBody(action, body) {
		let jsonBody = {
			'type': 'client',
			'action': action,
			'body': body
		};
		console.info(action, this.socket.readyState);
		if (this.socket.readyState !== 1) {
			this.queue.push(JSON.stringify(jsonBody));
			return;
		}
		this.socket.send(JSON.stringify(jsonBody));
	}

	createInitData(initContent) {
		return JSON.stringify({
			type: 'client',
			action: 'sendFirstMessage',
			body: {
				author: 'client',
				body: initContent
			}

		})
	}

	createRestoreData(rid){
		return JSON.stringify({
			type: 'client',
			action: 'restoreRoom',
			body: {
				rid
			}

		})
	}
}

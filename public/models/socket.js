'use strict';

import localforage from 'localforage';

export default class Socket {

	constructor({messageSend, addToNewRoom, roomClosed, body, restore, rid}) {
		this.socket = new WebSocket('ws://139.59.139.151/api/v1/client');
		this.socket.binaryType = "arraybuffer";
		this.queue = [];

		this.socket.onopen = () => {
			if (!restore) {
				this.socket.send(this.createInitData(body));
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
						localforage.setItem('message', recievedMessage.body.messages)
							.then( response => messageSend(recievedMessage.body));
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
		if (this.socket.readyState !== 1) {
			this.queue.push(JSON.stringify(jsonBody));
			return;
		}
		this.socket.send(JSON.stringify(jsonBody));
	}

	createInitData(body) {
		return JSON.stringify({
			type: 'client',
			action: 'sendFirstMessage',
			body
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

	sendFile(picture){
		this.socket.send(picture);
	}
}

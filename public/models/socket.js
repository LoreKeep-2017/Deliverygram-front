'use strict';

import localforage from 'localforage';

export default class Socket {

	constructor({messageSend, addToNewRoom, roomClosed, body, restore, rid}) {
		this.socket = new WebSocket('ws://139.59.139.151/api/v1/client');
		this.socket.binaryType = 'arraybuffer';
		this.queue = [];
		this.latency = true;

		this.socket.onopen = () => {
			if (!restore) {
				this.socket.send(this.createInitData(body));
				this.latency = false;
			} else {
				this.socket.send(this.createRestoreData(rid))
			}
			this.queue.forEach(item => this.socket.send(item));
		};

		this.socket.onmessage = (message) => {
			let recievedMessage = JSON.parse(message.data);
			console.info(this.latency, recievedMessage.code);
			if (recievedMessage.code === 200 && !this.latency) {
				switch (recievedMessage.action) {
					case 'addToRoom':
						addToNewRoom(recievedMessage.body);
						return;
					case 'sendMessage':
						localforage.setItem('message', recievedMessage.body.messages)
							.then(response => messageSend(recievedMessage.body));
						return;
					case 'roomClosed':
						roomClosed(recievedMessage.body);
						return;
				}
			}
			if (recievedMessage.action === 'restoreRoom') {
				this.latency = false;
				let pos;
				if (recievedMessage.code === 404) {
					this.queue.some((item, position) => {
						pos = position;
						return item.action === 'sendMessage'
					});
					console.info(pos, this.queue);
					this.queue[pos].action = 'sendFirstMessage';
				}
				this.queue.forEach(item => this.socket.send(item));
			}
		}
	}

	sendWithBody(action, body) {
		let jsonBody = {
			'type': 'client',
			'action': action,
			'body': body
		};
		if (this.socket.readyState !== 1 && this.latency) {
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

	createRestoreData(rid) {
		return JSON.stringify({
			type: 'client',
			action: 'restoreRoom',
			body: {
				rid
			}

		})
	}
}

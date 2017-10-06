'use strict';

export default class Socket {

	constructor({messageSend, addToNewRoom, roomClosed, title, message}) {
		this.socket = new WebSocket('ws://localhost:8000/api/v1/client/');

		this.socket.onopen = () => {
			this.socket.send(this.createInitData(title, message));
		};

		this.socket.onmessage = (message) => {
			let recievedMessage = JSON.parse(message.data)
			if (recievedMessage.code === 200) {
				switch (recievedMessage.action) {
					case 'addToRoom':
						addToNewRoom(recievedMessage.body);
						return;
					case 'sendMessage':
						messageSend(recievedMessage.body);
						return;
					case 'roomClosed':
						roomClosed(recievedMessage.body);
						return;
				}
			}
		}
	}

	sendMessage(message) {
		this.socket.send(JSON.stringify({
			type: 'client',
			action: 'sendMessage',
			body: {
				author: 'client',
				body: message
			}
		}))
	}

	createInitData(title, message) {
		return JSON.stringify({
			type: 'client',
			action: 'addToRoom',
			body: {
				title: title,
				description: message
			}

		})
	}
}

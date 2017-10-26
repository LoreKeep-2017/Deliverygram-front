'use strict';

export default class Socket {

	constructor({messageSend, addToNewRoom, roomClosed, initContent}) {
		this.socket = new WebSocket('ws://fin01.deliverygramm.park.bmstu.cloud:8080/api/v1/client');

		this.socket.onopen = () => {
			this.socket.send(this.createInitData(initContent));
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

	createInitData(initContent) {
		return JSON.stringify({
			type: 'client',
			action: 'sendDescriptionRoom',
			body: initContent

		})
	}
}

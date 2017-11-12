'use strict';


export default class Socket {

	constructor({receiveClients, receiveMessages, receiveOperators, changeRoomStatus, operatorId}) {
		this.socket = new WebSocket('ws://139.59.139.151/api/v1/operator');

		this.queue = [];
		this.socket.onopen = () => {
			this.sendWithBody('sendId', {id: operatorId});
			console.info(this.queue);
			this.queue.forEach(body => {
				this.socket.send(body)
			})
		};

		this.socket.onmessage = (message) => {
			let receivedMessage = JSON.parse(message.data);
			console.log(receivedMessage.action, receivedMessage.body);
			if (receivedMessage.code === 200) {
				switch (receivedMessage.action) {
					case 'getAllRooms':
					case 'getRoomsByStatus':
						receiveClients(receivedMessage.body);
						return;
					case 'changeStatusRoom':
						changeRoomStatus(receivedMessage.body);
						return;
					case 'sendMessage':
						receiveMessages(receivedMessage.body);
						return;
					case 'getAllMessages':
						receiveMessages(receivedMessage.body);
						return;
					case 'getOperators':
						receiveOperators(receivedMessage.body)
						return;
				}
			}
		}
	}

	sendWithoutBody(action) {
		let jsonBody = {
			'type': 'operator',
			'action': action
		};
		console.info(action, this.socket.readyState);
		if (this.socket.readyState !== 1) {
			this.queue.push(JSON.stringify(jsonBody));
			return;
		}
		this.socket.send(JSON.stringify(jsonBody))
	}

	sendWithBody(action, body) {
		let jsonBody = {
			'type': 'operator',
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
}

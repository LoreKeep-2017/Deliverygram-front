'use strict';


export default class Socket {

	constructor(receiveClients, receiveMessage, changeRoomStatus, operatorId) {
		// this.socket = new WebSocket('ws://fin01.deliverygramm.park.bmstu.cloud:8080/api/v1/operator');
		this.socket = new WebSocket('ws://139.59.139.151/api/v1/operator');

		this.queue = [];
		this.socket.onopen = () => {
			this.sendWithBody('sendId', {id: operatorId});
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
						receiveMessage(receivedMessage.body);
						return;
					case 'getAllMessages':
						receiveMessage(receivedMessage.body);
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
		if (this.socket.readyState === 0) {
			this.queue.push(JSON.stringify(jsonBody));
			return;
		}
		this.socket.send(JSON.stringify(jsonBody));
	}
}

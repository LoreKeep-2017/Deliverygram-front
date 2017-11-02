'use strict';


export default class Socket{

	constructor(receiveClients, receiveMessage, changeRoomStatus){
		// this.socket = new WebSocket('ws://fin01.deliverygramm.park.bmstu.cloud:8080/api/v1/operator');
		this.socket = new WebSocket('ws://localhost:8080/api/v1/operator');

		this.queue = [];
		this.socket.onopen = () => {
			this.queue.forEach(body => {
				this.socket.send(body)
			})
		};

		this.socket.onmessage = (message) => {
			let receivedMessage = JSON.parse(message.data);
			console.log(receivedMessage.action, receivedMessage.body);
			if (receivedMessage.code === 200){
				switch(receivedMessage.action) {
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
		if (this.socket.readyState !== 1){
			this.queue.push(JSON.stringify({
				'type': 'operator',
				'action': action
			}))
			return;
		}
		this.socket.send(JSON.stringify({
			'type': 'operator',
			'action': action
		}))
	}

	sendWithBody(action, body) {
		if (this.socket.readyState !== 1){
			this.queue.push(JSON.stringify({
				'type': 'operator',
				'action': action,
				'body': body
			}))
			return;
		}
		this.socket.send(JSON.stringify({
			'type': 'operator',
			'action': action,
			'body': body
		}))
	}
}

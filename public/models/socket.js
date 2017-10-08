'use strict';


export default class Socket{

	constructor(receiveClients, receiveMessage){
		this.socket = new WebSocket('ws://localhost:8000/api/ws');
		
		this.socket.onopen = () => {
			this.sendWithoutBody('getAllRooms');
		};

		this.socket.onmessage = (message) => {
			let receivedMessage = JSON.parse(message);
			if (receivedMessage.code === 200){
				switch(receivedMessage.action) {
					case 'getAllRooms':
						receiveClients(receivedMessage.body);
						return;
					case 'changeStatusRoom':
						return;
					case 'sendMessage':
						receiveMessage(receivedMessage.body);
						return;
				}
			}
		}
	}

	sendWithoutBody(action) {
		this.socket.send(JSON.stringify({
			'type': 'operator',
			'action': action
		}))
	}

	sendWithBody(action, body) {
		this.socket.send(JSON.stringify({
			'type': 'operator',
			'action': action,
			'body': body
		}))
	}
}

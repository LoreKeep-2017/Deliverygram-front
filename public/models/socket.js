'use strict';


export default class Socket{

	constructor(receiveClients, receiveMessage, changeRoomStatus){
		this.socket = new WebSocket('ws://localhost:8080/api/v1/operator');

		this.socket.onopen = () => {
			// sthis.sendWithoutBody('getAllRooms');
		};

		this.socket.onmessage = (message) => {
			let receivedMessage = JSON.parse(message.data);
			if (receivedMessage.code === 200){
				switch(receivedMessage.action) {
					case 'getAllRooms':
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

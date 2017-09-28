'use strict';


export default class Socket{

	constructor(dataRecieved){
		this.socket = new WebSocket('ws://85.195.79.230:8000/api/ws');
		
		this.socket.onopen = () => {
			console.log('Good conection');
		};

		this.socket.onmessage = (message) => {
			let recievedMessage = JSON.parse(message.data)
			console.log(recievedMessage.ctrl.id);
			console.log("Recieved message", JSON.parse(message.data));
			dataRecieved(recievedMessage.ctrl.id); 
		}
	}

	send(data)
	{
		this.socket.send(JSON.stringify(data));
	}
}

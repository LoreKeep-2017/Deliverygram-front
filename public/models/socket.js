'use strict';


export default class Socket{
	constructor(){
		this.socket = new WebSocket('ws://localhost:8000/api/ws');

		this.socket.onopen = () => {
			console.log('Good conection');
		};

		this.socket.onmessage = () => {
			console.log("Recieved message");
		}
	}

	send(data)
	{
		this.socket.send(JSON.stringify(data));
	}
}

'use strict';

import React from 'react'
import {
	Button,
	Card,
	Input,
	Form
} from 'antd'
import {changedData} from '../components/action';
import {connect} from 'react-redux'
import dataWorking from '../reducers/view'
import Socket from '../models/socket'
import {receiveData, requestData} from "./action";

class ChatButton extends React.Component {

	constructor() {
		super();
		this.state = {};
	}

	onClick(event, label) {
		let { 
			dataReceive
		} = this.props;
		if (!this.hasOwnProperty('socket')) {
			this.socket = new Socket(dataReceive);
		}
		this.setState({card: true});
	}

	getCard(messages) {
		let allMessages;
		if (messages) {
			allMessages = messages.map((item, position) => <p key={position}>{item}</p>);
		}
		return (<Card title={'Чат'} bordered={'true'}>
			{allMessages}
			<Form>
				<Form.Item/>
				<Input.TextArea autosize={{minRows: 2, maxRows: 4}} style={{width: 300, padding: 10}} defaultValue={''}
				                placeholder={'Введите свое сообщение'} onPressEnter={this.onPressEnter.bind(this)}/>
				<Form.Item/>
			</Form>
		</Card>);
	}

	onPressEnter(event, label) {
		let message = event.target.value;
		event.target.value = '';
		this.props.dataChanged(message);
		this.socket.send({Hi: {Id: message}});
	}

	render() {
		console.log(this.props);
		if (this.state.hasOwnProperty('card')) {
			return this.getCard(this.props.messages);
		}
		return (<Button
			onClick={this.onClick.bind(this)}
			size='large'
			style={{
				width: 200,
				height: 50,
				fontSize: 20,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>{'Начать чат'}</Button>)
	}
}

const FormButton = Form.create()(ChatButton)

const mapStateToProps = (state) => {
	return {
		messages: state.messages
	}
};

const mapDispatchToProps = dispatch => {
	return {
		dataChanged: (message) => dispatch(changedData(message)),
		dataReceive: (message) => dispatch(receiveData(message)),
		dataRequest: () => dispatch(requestData())
	}
};

const FullButton = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormButton);

export default FullButton

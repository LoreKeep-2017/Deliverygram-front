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
import Socket from '../models/socket'
import {receiveData, requestData} from "./action";
import './button.css';

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
			allMessages = messages.map((item, position) => <div className={`chat-card__${item.place}-message`}>
				<p className={`${item.place}-message`} key={position}>{item.message}</p>
			</div>);
		}
		return (<Card title={'Чат'} bordered style={{padding: 0}} className={'chat-card_border'}>
			{allMessages}
			<Form className={`chart-form`}>
				<Form.Item/>
				<Input.TextArea autosize={{minRows: 3, maxRows: 4}} className={'chart-input-area'} defaultValue={''}
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
			className={'start-button'}
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

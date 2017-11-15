'use strict';

import React from 'react'
import {
	Button,
	Form
} from 'antd'
import {connect} from 'react-redux'
import './button.less';
import axios from 'axios';
import localforage from 'localforage';
import {receiveGreetingMessage, sendGreetingMessage, switchToChatFrom} from './action';
import ChatForm from './chatForm'
import moment from "moment";

class ChatButton extends React.Component {

	componentDidMount() {
		const {
			receiveGreetingMessage,
			sendGreetingMessage
		} = this.props;
		axios.get('http://139.59.139.151/greating/',  { crossdomain: true })
			.then(response => {
				receiveGreetingMessage();
				localforage.setItem('greeting', {greetingMessage: response.data.greating});
				console.info('ololol')
				sendGreetingMessage({
					author: 'operator',
					body: response.data.greating,
					time: moment().unix()
				})
			})
			.catch(error => localforage.getItem('greeting')
				.then(response => {
					if (response) {
						localforage.setItem('greeting', {greetingMessage: 'Здравствуйте! Чем мы можем вам помочь?'})
					}
				}))
	}

	onClick() {
		this.props.switchToChatFrom();
	}

	render() {
		const {
			position,
			newMessages
		} = this.props;
		let notification;
		if (newMessages) {
			notification = `+${newMessages}`;
		}
		if (position) {
			switch (position) {
				case 'chatForm':
					return <ChatForm/>;
				default :
					return <h1>{'Sorry, there is some problem'}</h1>
			}
		}
		return (
			<Button
				onClick={() => this.onClick()}
				size='large'
				className={'start-button'}
				icon={'mail'}>
				{notification}
			</Button>)
	}
}

const FormButton = Form.create()(ChatButton);

const mapStateToProps = (state) => {
	return {
		position: state.position,
		newMessages: state.newMessages
	}
};

const mapDispatchToProps = dispatch => {
	return {
		switchToChatFrom: () => dispatch(switchToChatFrom()),
		receiveGreetingMessage: () => dispatch(receiveGreetingMessage()),
		sendGreetingMessage: (message) => dispatch(sendGreetingMessage(message))

	}
};

const FullButton = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormButton);

export default FullButton

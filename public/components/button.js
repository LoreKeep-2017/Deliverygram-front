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
		axios.get('http://139.59.139.151/greating/', {crossdomain: true})
			.then(response => {
				receiveGreetingMessage();
				localforage.setItem('greeting', {greetingMessage: response.data.greating});
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
			newMessages,
			switchToButton
		} = this.props;
		let notification, classList = 'start-button';
		if (newMessages) {
			classList += ' start-button__messages_appear';
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
		if (switchToButton) {
			classList += ' start-button_appear';
		}
		return (
			<Button
				onClick={() => this.onClick()}
				size='large'
				className={classList}
				icon={'mail'}>
				<span className={'notification_appear'}>
					{notification}
					</span>
			</Button>)
	}
}

const FormButton = Form.create()(ChatButton);

const mapStateToProps = (state) => {
	return {
		position: state.position,
		newMessages: state.newMessages,
		switchToButton: state.switchToButton
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

'use strict';

import React from 'react'
import {
	Form,
	Card,
	Button,
	Row,
	Input
} from 'antd'
import {connect} from 'react-redux';
import moment from 'moment';
import {
	addToNewRoom,
	askNickname,
	closeNickname,
	closeStartForm, getExtraMessages,
	getMessagesFromStore,
	messageSend,
	roomClosed,
	sendClientMessage,
	sendGreetingMessage
} from './action';
import Socket from '../models/socket'
import localforage from 'localforage';
import axios from 'axios';
import './chatForm.less';
import _ from 'lodash';

class CreateChatFrom extends React.Component {

	componentDidMount() {
		this.restorePrev();
	}

	close(position) {
		const {
			closeStartForm
		} = this.props;
		closeStartForm(position || 'chatForm');
	}

	onClick(event) {
		event.preventDefault();
		const {
			form: {
				getFieldValue,
				resetFields,
				setFieldsValue
			},
			messageSend,
			addToNewRoom,
			roomClosed,
			restore,
			rid,
			askNickname
		} = this.props;
		let message = getFieldValue('message');
		if (event.ctrlKey) {
			message += '\n';
			setFieldsValue({message});
			return;
		}
		resetFields();
		if (!this.socket) {
			this.socket = new Socket({messageSend, addToNewRoom, roomClosed, message, restore, rid});
			if (restore) {
				this.socket.sendWithBody('sendMessage', {
					author: 'client',
					body: message
				});
			} else {
				askNickname();
			}

		} else {
			this.socket.sendWithBody('sendMessage', {
				author: 'client',
				body: message
			});
		}
	}

	parseMessage(message) {
		let parsed = [];
		while (message.indexOf('\n') > -1) {
			let breakPosition = message.indexOf('\n');
			parsed.push(message.substring(0, breakPosition));
			message = message.substring(breakPosition + 1);
		}
		parsed.push(message);
		parsed = parsed.map((item, position) => (<Row key={`message__row_${position}`}>{item}</Row>))
		return parsed;
	}

	getMessages() {
		const {
			messages
		} = this.props;
		if (messages) {
			return messages.map((item, position) => {
				return (
				<div className={`chat-card__${item.author}-message`} key={`chat_message_${position}`}>
					<div className={`${item.author}-message__position`}>
						<p className={`${item.author}-message`} key={position}>{this.parseMessage(item.body)}</p>
					</div>
					<p className={'message__time'}
					   key={`message_${position}-time__${item.time}`}>{moment.unix(item.time).format('HH:mm')}</p>
				</div>
			)})
		}
	}

	restorePrev() {
		const {
			getMessagesFromStore,
			sendGreetingMessage,
			getExtraMessages
		} = this.props;
		localforage.getItem('message').then(messages => {
			localforage.getItem('greeting')
				.then(value => {
					if (value && value.greetingMessage) {
						sendGreetingMessage({
							author: 'operator',
							body: value.greetingMessage,
							time: moment().unix()
						})
					}
					if (messages) {
						getMessagesFromStore(messages);
						console.info(messages);
						if (messages[1].room) {
							axios.get(`http://139.59.139.151/diff/?id=${messages[1].room}&size=${messages.length - 1}`)
								.then(response => {
									if (response.data.body) {
										messages = _.concat(messages, response.data.body);
										console.log(messages);
										localforage.setItem('message', messages).then(item =>
											getExtraMessages(response.data.body)
										)
									}
								})
						}
					}
				})
		})
	}

	getNickname() {
		const {
			form: {
				getFieldValue
			},
			closeNickname
		} = this.props;
		let nickname = getFieldValue('nickname');
		this.socket.sendWithBody('sendNickname', {nickname});
		closeNickname();
	}

	render() {
		const {
			form: {
				getFieldDecorator
			},
			nickname,
			closeNickname
		} = this.props;
		let nickInput;
		if (nickname) {
			nickInput = (
				<Card className={'nickname-card'}>
					<div className={'nickname-title'}>
						{'Как к вам можно обращаться: '}
						<Button icon={'close'} size={'small'} className={'close-nickname-button'}
						        onClick={() => closeNickname()}/>
					</div>
					<Form className={'nickname-form'}>
						<Form.Item/>
						{getFieldDecorator('nickname', {})(
							<Input onPressEnter={(event) => this.getNickname()}
							/>)}
						<Form.Item/>
					</Form>
				</Card>
			)
		}
		return (
			<Row className={'messandger-area'}>
				<Row className={'close-option'}>
					<Button icon={'close'} className={'close-button'} onClick={() => this.close()}/>
				</Row>
				<Card title={'Напишите ваше сообщение'} bordered>
					{nickInput}
					<Card className={'card-content'}
					      ref={card => {
						      if (card)
							      card.container.scrollTop = card.container.scrollHeight
					      }}>
						{this.getMessages()}
					</Card>
					<Form className={`chat-form`}>
						<Form.Item/>
						{getFieldDecorator('message', {})(
							<Input.TextArea autosize={{minRows: 3, maxRows: 3}}
							                className={'chat-input__textarea'}
							                placeholder={'Введите свое сообщение'}
							                onPressEnter={(event) => this.onClick(event)}
							/>)}
						<Form.Item/>
					</Form>
				</Card>
			</Row>);
	}
}

const FormChatForm = Form.create()(CreateChatFrom);

const mapStateToProps = state => ({
	messages: state.messages,
	nick: state.nick,
	description: state.description,
	restore: state.restore,
	showGreeting: state.showGreeting,
	rid: state.rid,
	nickname: state.nickname
});

const mapDispatchToProps = dispatch => {
	return {
		addToNewRoom: (data) => dispatch(addToNewRoom(data)),
		messageSend: (data) => dispatch(messageSend(data)),
		roomClosed: (data) => dispatch(roomClosed(data)),
		sendClientMessage: () => dispatch(sendClientMessage()),
		getMessagesFromStore: (messages) => dispatch(getMessagesFromStore(messages)),
		closeStartForm: (lastPosition) => dispatch(closeStartForm(lastPosition)),
		sendGreetingMessage: (message) => dispatch(sendGreetingMessage(message)),
		askNickname: () => dispatch(askNickname()),
		closeNickname: () => dispatch(closeNickname()),
		getExtraMessages: (messages) => dispatch(getExtraMessages(messages))
	}
}

const ChatForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormChatForm);

export default ChatForm

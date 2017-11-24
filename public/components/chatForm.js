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
import Messages from './messages';
import localforage from 'localforage';
import axios from 'axios';
import './chatForm.less';
import _ from 'lodash';
import {Picker} from 'emoji-mart';
import Twemoji from 'react-twemoji';
import ContentEditable from 'react-contenteditable'


class CreateChatFrom extends React.Component {

	constructor() {
		super();
		this.state = {
			showPicker: false,
			contentState: 'Введите сообщение...',
			sendState: ''
		}
	}

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
			messageSend,
			addToNewRoom,
			roomClosed,
			restore,
			rid,
			askNickname
		} = this.props;
		let message = this.state.sendState;
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
		this.editable.lastHtml = '';
		this.setState({
			contentState: '\n',
			sendState: ''
		})
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

	addEmojiToInput(emoji) {
		let message = this.editable.lastHtml;
		message += emoji.native;
		this.setState({
			showPicker: false,
			contentState: message,
			sendState: message
		})
	}

	render() {
		const {
			form: {
				getFieldDecorator
			},
			nickname,
			closeNickname
		} = this.props;
		let nickInput, picker;
		if (this.state.showPicker) {
			picker =
				<Picker className={'emoji-picker'} style={{position: 'absolute', right: 0, bottom: 80}}
				        set={'emojione'}
				        onClick={(emoji, moreInfo) => this.addEmojiToInput(emoji)}/>
		}
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
					<Messages/>
					{picker}
					<Form className={`chat-form`}>
						<Twemoji options={{className: 'twemoji'}}>
							<ContentEditable
								ref={editable => this.editable = editable}
								className={'chat-input__textarea'}
								html={this.state.contentState}
								onKeyDown={event => {
									if (event.key === 'Control' || event.key === 'Enter') {
										this[event.key] = true;
									}
									if (!this.Control && this.Enter) {
										this.onClick(event);
									}
									if (this.Control && this.Enter) {
										document.execCommand('insertHTML', false, '<br><br>');
										this.setState({sendState: this.state.sendState + '\n'})
									}
									if (event.key.length === 1){
										this.setState({sendState: this.state.sendState + event.key})
									}
								}}
								onKeyUp={event => {
									if (event.key === 'Control' || event.key === 'Enter') {
										this[event.key] = false;
									}
								}}
								onBlur={() => {
									if (!this.editable.lastHtml) {
										this.setState({contentState: 'Введите сообщение...'})
									}
								}}
								onFocus={() => {
									if (this.state.contentState === 'Введите сообщение...') {
										this.setState({contentState: ''})
									}
								}}>
							</ContentEditable>
						</Twemoji>
						<Button className={'picker-button'}>
							<p className={'emoji-select'}
							   onClick={event => this.setState({showPicker: true})}>{String.fromCodePoint(0x1F600)}
							</p>
						</Button>
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

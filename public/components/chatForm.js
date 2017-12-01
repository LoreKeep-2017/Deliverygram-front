'use strict';

import React from 'react'
import {
	Form,
	Card,
	Button,
	Row,
	Input,
	Icon
} from 'antd'
import {connect} from 'react-redux';
import moment from 'moment';
import {
	addToNewRoom,
	askNickname,
	closeNickname,
	closeStartForm,
	getExtraMessages,
	getMessagesFromStore,
	hideEmojis, imageUpload,
	messageSend, removeImage,
	roomClosed,
	sendClientMessage,
	sendGreetingMessage,
	showEmojis
} from './action';
import Messages from './messages';
import MainForm from './mainForm';
import localforage from 'localforage';
import axios from 'axios';
import './chatForm.less';
import _ from 'lodash';
import {Picker} from 'emoji-mart';

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

	addEmojiToInput(emoji) {
		const {
			hideEmojis
		} = this.props;
		let message = this.editable.lastHtml || '';
		message += emoji.native;
		hideEmojis();
		this.setState({
			contentState: message,
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
			closeNickname,
			hideEmojis,
			showPicker,
			images,
		} = this.props;
		let {
			mainRowClass
		} = this.props;
		let nickInput, picker;
		if (images && images.length > 0) {
			mainRowClass += ' messandger-area_extra-height';
		} else if (mainRowClass.indexOf('messandger-area_appear') === -1) {
			mainRowClass += ' messandger-area_extra-height-remove';
		}
		if (showPicker) {
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
						<Form.Item>
							{getFieldDecorator('nickname', {})(
								<Input onPressEnter={(event) => this.getNickname()}
								/>)}
						</Form.Item>
					</Form>
				</Card>
			)
		}
		return (
			<Row className={mainRowClass}
			     onClick={() => {
				     if (showPicker) {
					     hideEmojis()
				     }
			     }}>
				<Row className={'close-option'}>
					<Button icon={'close'} className={'close-button'} onClick={() => this.close()}/>
				</Row>
				<Card title={'Напишите ваше сообщение'} bordered>
					{nickInput}
					<Messages/>
					{picker}
					<MainForm/>
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
	nickname: state.nickname,
	showPicker: state.showPicker,
	images: state.images,
	format: state.format,
	name: state.name,
	mainRowClass: state.mainRowClass
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
		getExtraMessages: (messages) => dispatch(getExtraMessages(messages)),
		showEmojis: () => dispatch(showEmojis()),
		hideEmojis: () => dispatch(hideEmojis()),
		imageUpload: (image, format, name) => dispatch(imageUpload(image, format, name)),
		removeImage: (position) => dispatch(removeImage(position))
	}
}

const ChatForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormChatForm);

export default ChatForm

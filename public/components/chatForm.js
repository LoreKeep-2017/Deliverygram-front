'use strict';

import React from 'react'
import {
	Form,
	Card,
	Button,
	Row,
	Input,
} from 'antd'
import {connect} from 'react-redux';
import moment from 'moment';
import {
	closeNickname,
	closeStartForm,
	getExtraMessages,
	getMessagesFromStore, hideEmojis,
	removeFullScreenImage,
	sendGreetingMessage,
} from './action';
import Messages from './messages';
import MainForm from './mainForm';
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
						messages.shift();
						if (messages[0].room) {
							axios.get(`http://139.59.139.151/diff/?id=${messages[0].room}&size=${messages.length - 1}`)
								.then(response => {
									if (response.data.body) {
										response.data.body.messages = _.reverse(response.data.body.messages);
										messages = _.concat(messages, response.data.body.messages);
										localforage.setItem('message', messages).then(item => {
												messages.shift();
												getExtraMessages(messages)
											}
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
			closeNickname,
			socket
		} = this.props;
		let nickname = getFieldValue('nickname');
		socket.sendWithBody('sendNickname', {nickname});
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
			images,
			src,
			showPicker,
			removeFullScreenImage
		} = this.props;
		let {
			mainRowClass
		} = this.props;
		let nickInput, picker, fullImage;
		if (images && images.length > 0) {
			mainRowClass += ' messandger-area_extra-height';
		} else if (mainRowClass.indexOf('messandger-area_appear') === -1) {
			mainRowClass += ' messandger-area_extra-height-remove';
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
		if (src) {
			fullImage = (
				<div className={'full-screen-image'}>
					<Button icon={'close'} className={'close-full-image'} onClick={() => {
						removeFullScreenImage()
					}}/>
					<div className={'image-content'}>
						<img src={src}/>
					</div>
				</div>)
		}
		return (
			<Row className={mainRowClass}
			     onClick={() => {
				     console.info(showPicker);
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
				{fullImage}
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
	mainRowClass: state.mainRowClass,
	src: state.src,
	socket: state.socket
});

const mapDispatchToProps = dispatch => {
	return {
		getMessagesFromStore: (messages) => dispatch(getMessagesFromStore(messages)),
		hideEmojis: () => dispatch(hideEmojis()),
		closeStartForm: (lastPosition) => dispatch(closeStartForm(lastPosition)),
		sendGreetingMessage: (message) => dispatch(sendGreetingMessage(message)),
		closeNickname: () => dispatch(closeNickname()),
		getExtraMessages: (messages) => dispatch(getExtraMessages(messages)),
		removeFullScreenImage: () => dispatch(removeFullScreenImage())
	}
};

const ChatForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormChatForm);

export default ChatForm

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
import Socket from '../models/socket'
import Messages from './messages';
import localforage from 'localforage';
import axios from 'axios';
import './chatForm.less';
import _ from 'lodash';
import {Picker} from 'emoji-mart';
import Twemoji from 'react-twemoji';
import ContentEditable from 'react-contenteditable'
import Files from 'react-files'

class CreateChatFrom extends React.Component {

	constructor() {
		super();
		this.state = {
			ignore: true,
			contentState: '<p class="placeholder">Введите сообщение...</p>',
			sendState: '',
			mainRowClass: 'messandger-area messandger-area_appear'
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
		const {
			hideEmojis
		} = this.props;
		let message = this.editable.lastHtml || '';
		message += emoji.native;
		hideEmojis();
		this.setState({
			contentState: message,
			sendState: message
		})
	}

	fileLoad(file) {
		console.info(file);
		const {
			imageUpload,
			images
		} = this.props;
		file.forEach((item, position) => {
			if (!images || position >= images.length) {
				console.info(item);
				let blob = new Blob([item], {type: item.type});
				let reader = new FileReader();
				reader.onload = (event) => {
					let base64 = reader.result;
					base64 = base64.replace('/\\r?\\n|\\r/g', '');
					imageUpload(base64);
					// this.socket.sendWithBody('sendMessage', {
					// 	'author': 'client',
					// 	'body': '',
					// 	'image': base64,
					// 	'imageFormat': 'jpeg'
					// });
				};
				reader.readAsDataURL(blob);
			}
		})
		this.setState({mainRowClass: 'messandger-area'})
	}

	onKeyDown(event) {
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
		if (event.key.length === 1) {
			this.setState({sendState: this.state.sendState + event.key})
		}
	}

	render() {
		const {
			form: {
				getFieldDecorator
			},
			nickname,
			closeNickname,
			showEmojis,
			hideEmojis,
			showPicker,
			images,
			removeImage
		} = this.props;
		let nickInput, picker;
		let {mainRowClass} = this.state;
		let chatFormClass = 'chat-form';
		let imagesContent = [];
		if (images && images.length > 0) {
			mainRowClass += ' messandger-area_extra-height';
			chatFormClass += ' chat-form_extra-height';
			console.info(images);
			images.forEach((image, position) => {
				imagesContent.push(
					<div className={'image-content__content'} key={`image_content_${position}`}>
						<Button icon={'close'} className={'remove-button'} onClick={() => removeImage(position)}/>
						<img src={image} className={'download-image'}/>
					</div>
				)
			})
		} else if (mainRowClass.indexOf('messandger-area_appear') === -1) {
			mainRowClass += ' messandger-area_extra-height-remove';
			chatFormClass += ' chat-form_extra-height-remove';
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
				     if (!this.state.ignore) {
					     hideEmojis();
					     this.setState({ignore: true});
				     } else {
					     this.setState({ignore: false});
				     }
			     }}>
				<Row className={'close-option'}>
					<Button icon={'close'} className={'close-button'} onClick={() => this.close()}/>
				</Row>
				<Card title={'Напишите ваше сообщение'} bordered>
					{nickInput}
					<Messages/>
					{picker}
					<Form className={chatFormClass}>
						<Twemoji options={{className: 'twemoji'}}>
							<div className={'text-image'}>
								<ContentEditable
									ref={editable => this.editable = editable}
									className={'chat-input__textarea'}
									html={this.state.contentState}
									onKeyDown={event => this.onKeyDown(event)}
									onKeyUp={event => {
										if (event.key === 'Control' || event.key === 'Enter') {
											this[event.key] = false;
										}
									}}
									onBlur={() => {
										if (!this.editable.lastHtml) {
											this.setState({contentState: '<p class="placeholder">Введите сообщение...</p>'})
										}
									}}
									onFocus={() => {
										if (this.state.contentState === '<p class="placeholder">Введите сообщение...</p>') {
											this.setState({contentState: ''})
										}
									}}>
								</ContentEditable>
								<div className={'images-content'}>
									{imagesContent}
								</div>
							</div>
						</Twemoji>
						<div className={'control-buttons'}>
							<Button className={'picker-button'}>
								<p className={'emoji-select'}
								   onClick={() => {
									   showEmojis();
									   this.setState({ignore: false});
								   }}>
									<Twemoji>
										{String.fromCodePoint(0x1F600)}
									</Twemoji>
								</p>
							</Button>
							<Button icon={'download'} className={'picker-image__button'}>
								<Files
									className='files-dropzone'
									onChange={(event) => this.fileLoad(event)}
									onError={(event, some) => console.log(event)}
									accepts={['image/*']}
									multiple
									maxFiles={3}
									maxFileSize={10000000}
									minFileSize={0}
									clickable
								/>
							</Button>
						</div>
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
	nickname: state.nickname,
	showPicker: state.showPicker,
	images: state.images
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
		imageUpload: (image) => dispatch(imageUpload(image)),
		removeImage: (position) => dispatch(removeImage(position))
	}
}

const ChatForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormChatForm);

export default ChatForm

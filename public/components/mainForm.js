'use strict';

import React from 'react'
import {
	Form,
	Button,
} from 'antd'
import {connect} from 'react-redux';
import {
	askNickname, hideEmojis,
	imageUpload,
	messageSend, removeImage, saveSocket,
	showEmojis
} from './action';
import './chatForm.less';
import _ from 'lodash';
import Twemoji from 'react-twemoji';
import {Picker} from 'emoji-mart';
import ContentEditable from 'react-contenteditable'
import Files from 'react-files'
import Socket from '../models/socket';

class MainFormInit extends React.Component {

	constructor() {
		super();
		this.message = '';
		this.state = {
			contentState: '<p class="placeholder">Введите сообщение...</p>',
			lastState: ''
		}
	}

	onClick(event, icon) {
		event.preventDefault();
		const {
			messageSend,
			addToNewRoom,
			roomClosed,
			restore,
			rid,
			askNickname,
			images,
			format,
			removeImage,
			saveSocket
		} = this.props;
		let message = this.message || this.editable.lastHtml;
		let startPosition = 0;
		if (message || (images && images.length > 0)) {
			if (message) {
				while (message.indexOf('<br>', startPosition) > -1) {
					let position = message.indexOf('<br>');
					message = message.slice(0, position) + '\n' + message.slice(position + 4);
					startPosition = position;
				}
			}
			let body;
			if (images && images.length > 0) {
				body = {
					'author': 'client',
					'body': message,
					'image': images[0],
					'imageFormat': format[0]
				};
			} else {
				body = {
					author: 'client',
					body: message
				};
			}
			if (!this.socket) {
				this.socket = new Socket({messageSend, addToNewRoom, roomClosed, body, restore, rid});
				if (restore) {
					this.socket.sendWithBody('sendMessage', body);
				} else {
					askNickname();
				}
				saveSocket(this.socket);
			} else {
				this.socket.sendWithBody('sendMessage', body);
			}
			if (images && images.length > 0) {
				removeImage(0);
			}
		}
		this.message = '';
		if (icon) {
			if (this.state.lastState === '') {
				this.setState({
					contentState: '<p class="placeholder">Введите сообщение...<br></p>',
					lastState: ''
				});
			} else {
				this.setState({
					contentState: '<p class="placeholder">Введите сообщение...</p>',
					lastState: '\n'
				});
			}
			return;
		}
		if (this.state.lastState === '') {
			this.setState({
				contentState: '',
				lastState: '\n'
			})
		} else {
			this.setState({
				contentState: '\n',
				lastState: ''
			})
		}
	}

	fileLoad(file) {
		const {
			imageUpload,
			name,
			activeName
		} = this.props;
		file.forEach((item, position) => {
			console.info(activeName, position);
			if (_.indexOf(name, item.name) === -1 || _.indexOf(activeName, position) === -1) {
				let blob = new Blob([item], {type: item.type});
				let reader = new FileReader();
				reader.onload = () => {
					let base64 = reader.result;
					base64 = base64.replace('/\\r?\\n|\\r/g', '');
					imageUpload(base64, item.type.slice(item.type.indexOf('/') + 1), item.name);
				};
				reader.readAsDataURL(blob);
			}
		});
	}

	onKeyDown(event) {
		if (event.key === 'Control' || event.key === 'Enter') {
			this[event.key] = true;
		}
		if (!this.Control && this.Enter) {
			this.onClick(event);
		}
		if (this.Control && this.Enter) {
			let sel = window.getSelection();
			let range = sel.getRangeAt(0);
			if (range.endOffset === this.editable.lastHtml.length) {
				document.execCommand('insertHTML', false, '<br><br>');
			} else {
				document.execCommand('insertHTML', false, '<br>');
			}
		}
		console.info('olololo');
		if (event.key.length === 1){
			this.message += event.key;
		}
	}

	addEmojiToInput(emoji) {
		const {
			hideEmojis
		} = this.props;
		let message = this.editable.lastHtml || '';
		message += emoji.native;
		this.message += emoji.native;
		hideEmojis();
		this.setState({
			contentState: message,
		})
	}


	render() {
		const {
			showEmojis,
			images,
			removeImage,
			noImages,
			showPicker
		} = this.props;
		let chatFormClass = 'chat-form';
		let imagesContent, picker;
		if (images && images.length > 0) {
			chatFormClass += ' chat-form_extra-height';
			let readyImages = [];
			images.forEach((image, position) => {
				readyImages.push(
					<div className={'image-content__content'} key={`image_content_${position}`}>
						<Button icon={'close'} className={'remove-button'} onClick={() => removeImage(position)}/>
						<img src={image} className={'download-image'}/>
					</div>
				)
			});
			imagesContent = (
				<div className={'images-content'}>
					{readyImages}
				</div>)
		} else if (noImages) {
			chatFormClass += ' chat-form_extra-height-remove';
		}
		if (showPicker) {
			picker =
				<Picker className={'emoji-picker'} style={{position: 'absolute', right: 0, bottom: 80}}
				        set={'emojione'}
				        onClick={(emoji, moreInfo) => this.addEmojiToInput(emoji)}/>
		}
		return (
			<Form className={chatFormClass}>
			      {picker}
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
								if (!this.editable.lastHtml && !this.message) {
									this.setState({contentState: '<p class="placeholder">Введите сообщение...</p>'})
								}
							}}
							onFocus={() => {
								if (this.state.contentState.indexOf('<p class="placeholder">Введите сообщение...') > -1) {
									if (this.state.lastState === '') {
										this.setState({
											contentState: '',
											lastState: '\n'
										})
									} else {
										this.setState({
											contentState: '\n',
											lastState: ''
										})
									}
								}
							}}>
						</ContentEditable>
						{imagesContent}
					</div>
				</Twemoji>
				<div className={'control-buttons'}>
					<Button className={'picker-button'}
					        onClick={(event) => {
						        showEmojis();
						        event.stopPropagation();
					        }}>
						<p className={'emoji-select'}>
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
							maxFileSize={10000000}
							minFileSize={0}
							clickable
						/>
					</Button>
				</div>
				<Button icon={'edit'} className={'send-button'} onClick={event => this.onClick(event, true)}/>
			</Form>
		)
	}
}

const mapStateToProps = state => ({
	restore: state.restore,
	rid: state.rid,
	images: state.images,
	format: state.format,
	name: state.name,
	noImages: state.noImages,
	activeName: state.activeName,
	showPicker: state.showPicker,
});

const mapDispatchToProps = dispatch => {
	return {
		askNickname: () => dispatch(askNickname()),
		messageSend: (data) => dispatch(messageSend(data)),
		showEmojis: () => dispatch(showEmojis()),
		imageUpload: (image, format, name) => dispatch(imageUpload(image, format, name)),
		removeImage: (position) => dispatch(removeImage(position)),
		saveSocket: (socket) => dispatch(saveSocket(socket)),
		hideEmojis: () => dispatch(hideEmojis()),
	}
}

const MainForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(MainFormInit);

export default MainForm
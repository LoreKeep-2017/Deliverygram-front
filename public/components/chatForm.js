'use strict';

import React from 'react'
import {
	Form,
	Card,
	Button,
	Row,
	Input,
	Popconfirm
} from 'antd'
import {connect} from 'react-redux'
import {addToNewRoom, closeStartForm, getMessagesFromStore, messageSend, roomClosed, sendClientMessage} from './action';
import Socket from '../models/socket'
import localforage from 'localforage';
import './createChatForm.less'

class CreateChatFrom extends React.Component {

	componentDidMount() {
		const {
			messageSend,
			addToNewRoom,
			roomClosed,
			title,
			description,
			nick,
			restore
		} = this.props;
		let initContent = {title, description, nick}
		if (!restore) {
			localforage.clear().then((value) => localforage.setItem('title', title));
		}
		this.socket = new Socket({messageSend, addToNewRoom, roomClosed, initContent});
	}

	close(position) {
		const {
			closeStartForm
		} = this.props;
		closeStartForm(position || 'chatForm');
	}

	onClick(event) {
		const {
			getFieldValue,
			resetFields,
			setFieldsValue

		} = this.props.form;
		let message = getFieldValue('message');
		if (event.ctrlKey) {
			message += '\n';
			setFieldsValue({message});
			return;
		}
		resetFields();
		this.setMessagesToStore(message);
		this.socket.sendMessage(message);
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

	setMessagesToStore(message) {
		let messages;
		localforage.getItem('message').then(value => {
			messages = value || [];
			messages.push({
				author: 'client',
				body: message
			});
			localforage.setItem('message', messages)
				.then(value => console.info(value));
		})
	}

	getMessages() {
		const {
			messages
		} = this.props;
		if (messages) {
			return messages.map((item, position) => (
				<div className={`chat-card__${item.author}-message`} key={`chat_message_${position}`}>
					<div className={`${item.author}-message__position`}>
						<p className={`${item.author}-message`} key={position}>{this.parseMessage(item.body)}</p>
					</div>
				</div>
			))
		}
	}

	restorePrev() {
		const {
			getMessagesFromStore,
			loaded
		} = this.props;
		if (!loaded) {
			localforage.getItem('message').then(messages => {
				localforage.getItem('title').then(title => {
					console.info(title);
					getMessagesFromStore(messages, title)
				})
			})
		}
	}

	render() {
		const {
			title,
			restore,
			form: {
				getFieldDecorator
			}
		} = this.props;
		let {
			messages
		} = this.props;
		if (restore) {
			this.restorePrev();
			return (
				<Row style={{width: '25vw'}}>
					<div style={{float: 'right'}}>
						<Button icon={'minus'} className={'closeButton'} onClick={() => this.close('restoreChat')}/>
					</div>
					<Card title={title} bordered>
						<Card className={'card-content'}
						      ref={card => {
							      if (card)
								      card.container.scrollTop = card.container.scrollHeight
						      }}>
							{this.getMessages()}
						</Card>
					</Card>
				</Row>)
		}
		let allMessages;
		if (messages) {
			allMessages = this.getMessages();
		}
		return (
			<Row style={{width: '25vw'}}>
				<Row style={{float: 'right'}}>
					<Row className={'closeOption'}>
					<Button icon={'minus'} className={'closeButton'} onClick={() => this.close()}/>
					<Popconfirm title="Вы уверены, что хотите закончить диалог?" onConfirm={() => this.close()}
					            okText="Yes" cancelText="No">
						<Button icon={'close'} className={'closeButton'}/>
					</Popconfirm>
					</Row>
				</Row>
				<Card title={title} bordered>
					<Card className={'card-content'}
					      ref={card => {
						      if (card)
							      card.container.scrollTop = card.container.scrollHeight
					      }}>
						{allMessages}
					</Card>
					<Form className={`chat-form`}>
						<Form.Item/>
						{getFieldDecorator('message', {})(
							<Input.TextArea autosize={{minRows: 3, maxRows: 4}}
							                className={'chat-input__textarea'}
							                placeholder={'Введите свое сообщение'}
							                onPressEnter={(event) => {
								                event.preventDefault();
								                this.onClick(event);
							                }}
							/>)}
						<Form.Item/>
					</Form>
				</Card>
			</Row>);
	}
}

const FormChatForm = Form.create()(CreateChatFrom);

const mapStateToProps = state => {
	return {
		messages: state.messages,
		title: state.title,
		nick: state.nick,
		description: state.description,
		restore: state.restore,
		loaded: state.loaded
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addToNewRoom: (data) => dispatch(addToNewRoom(data)),
		messageSend: (data) => dispatch(messageSend(data)),
		roomClosed: (data) => dispatch(roomClosed(data)),
		sendClientMessage: () => dispatch(sendClientMessage()),
		getMessagesFromStore: (messages, title) => dispatch(getMessagesFromStore(messages, title)),
		closeStartForm: (lastPosition) => dispatch(closeStartForm(lastPosition)),
	}
}

const ChatForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormChatForm);

export default ChatForm

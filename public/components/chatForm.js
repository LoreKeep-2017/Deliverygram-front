'use strict';

import React from 'react'
import {
	Form,
	Card,
	Button,
	Input
} from 'antd'
import {connect} from 'react-redux'
import {addToNewRoom, messageSend, roomClosed} from './action';
import Socket from '../models/socket'


class CreateChatFrom extends React.Component {

	componentDidMount() {
		const {
			messageSend,
			addToNewRoom,
			roomClosed,
			title,
			description,
			nick
		} = this.props;
		let initContent = {title, description, nick}
		this.socket = new Socket({messageSend, addToNewRoom, roomClosed, initContent});
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
		parsed = parsed.map((item, position) => (<p key={`message__row_${position}`}>{item}</p>))
		return parsed;
	}

	render() {
		const {
			messages,
			title,
			form: {
				getFieldDecorator
			}
		} = this.props;
		let allMessages;
		if (messages) {
			allMessages = messages.map((item, position) => (
				<div className={`chat-card__${item.author}-message`} key={`chat_message_${position}`}>
					<div className={`${item.author}-message__position`}>
						<p className={`${item.author}-message`} key={position}>{this.parseMessage(item.body)}</p>
					</div>
				</div>
			))
		}
		return (<Card title={title} bordered style={{width: '25vw'}}>
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
		</Card>);
	}
}

const FormChatForm = Form.create()(CreateChatFrom);

const mapStateToProps = state => {
	return {
		messages: state.messages,
		title: state.title,
		nick: state.nick,
		description: state.description
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addToNewRoom: (data) => dispatch(addToNewRoom(data)),
		messageSend: (data) => dispatch(messageSend(data)),
		roomClosed: (data) => dispatch(roomClosed(data))
	}
}

const ChatForm = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormChatForm);

export default ChatForm

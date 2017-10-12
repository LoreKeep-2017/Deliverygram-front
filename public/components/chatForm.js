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

	onClick() {
		const {
			getFieldValue,
			resetFields
		} = this.props.form;
		this.socket.sendMessage(getFieldValue('message'));
		resetFields();
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
						<p className={`${item.author}-message`} key={position}>{item.body}</p>
					</div>
				</div>
			))
		}
		return (<Card title={title} bordered style={{width: '25vw'}}>
			{allMessages}
			<Form className={`chat-form`}>
				<Form.Item/>
				{getFieldDecorator('message', {})(<Input.TextArea autosize={{minRows: 3, maxRows: 4}}
				                                                  className={'chat-input__textarea'}
				                                                  placeholder={'Введите свое сообщение'}
				                                                  onPressEnter={() => this.onClick()}
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

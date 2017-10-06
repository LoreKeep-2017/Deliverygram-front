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
			message
		} = this.props;
		this.socket = new Socket({messageSend, addToNewRoom, roomClosed, title, message});
	}

	onClick() {
		const {
			getFieldValue,
			resetFields
		} = this.props.form;
		this.socket.sendData(getFieldValue('message'));
		resetFields();
	}

	render() {
		const {
			messages,
			issue,
			form: {
				getFieldDecorator
			}
		} = this.props;
		let allMessages;
		if (messages) {
			allMessages = messages.map((item, position) => {
				return (<div className={`chat-card__${item.place}-message`} key={`chat_message_${position}`}>
					<p className={`${item.place}-message`} key={position}>{item.message}</p>
				</div>)
			})
		}
		return (<Card title={issue} bordered style={{width: '25vw'}}>
			{allMessages}
			<Form className={`chat-form`}>
				<Form.Item/>
				{getFieldDecorator('message', {})(<Input.TextArea autosize={{minRows: 3, maxRows: 4}}
				                                                  className={'chat-input__textarea'}
				                                                  placeholder={'Введите свое сообщение'}/>)}
				<Form.Item/>
				<Button onClick={() => this.onClick()} className={'chat-input__button'}>{'Отправить'}</Button>
			</Form>
		</Card>);
	}
}

const FormChatForm = Form.create()(CreateChatFrom);

const mapStateToProps = state => {
	return {
		messages: state.messages,
		title: state.title
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

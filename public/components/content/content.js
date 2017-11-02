'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {
	Layout,
	Button,
	Card,
	Form,
	Input
} from 'antd';
import {
	changeRoomStatus,
	receiveMessages,
	sendMessage
} from '../../view/action';
import ChatHeader from '../header/chatHeader'

const {
	Content,
} = Layout

class CreateInitContent extends React.Component {

	getMessages() {
		const {
			messages,
			selectedRoom,
			clients
		} = this.props;
		let allMessages = [];
		if (clients && clients.rooms[selectedRoom] && clients.rooms[selectedRoom].messages) {
			clients.rooms[selectedRoom].messages.forEach((item, position) => {
				allMessages.push(
					<div className={`${item.author}-message`} key={`message_${position}`}>
						<div className={`${item.author}-message_position`}>
							{this.parseMessage(item.body)}
						</div>
					</div>)
			});
		}
		return allMessages;
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

	onClick(event) {
		const {
			sendMessage,
			form: {
				getFieldValue,
				resetFields,
				setFieldsValue
			},
			selectedRoom,
			socket
		} = this.props;
		let message = getFieldValue('message');
		resetFields(['message']);
		if (event.ctrlKey) {
			message += '\n';
			setFieldsValue({message});
			return;
		}
		sendMessage(message, selectedRoom);
		socket.sendWithBody('sendMessage', {
			room: +selectedRoom,
			body: message,
			author: 'operator'
		})
	}

	getChatForm() {
		const {
			status,
			selectedRoom,
			form: {
				getFieldDecorator
			}
		} = this.props;
		if (status === 'roomBusy' && selectedRoom) {
			return (
				<Form className={'operator-chat'}>
					<Form.Item style={{width: '100%'}}>
						{getFieldDecorator('message', {initialValue: ''})(
							<Input.TextArea autosize={{minRows: 3, maxRows: 5}}
							                placeholder={'Введите свое сообщение'}
							                className={'operator-chat__input-form'}
							                onPressEnter={(event) => {
								                event.preventDefault();
								                this.onClick(event)
							                }
							                }/>
						)}
					</Form.Item>
				</Form>
			)
		}
	}

	render() {
		return (
			<Layout style={{
				marginLeft: '28vw',
				paddingLeft: '5vw',
				minWidth: '50vw',
				paddingRight: '5vw',
				marginRight: '5vw'
			}}>
				<ChatHeader socket={this.props.socket}/>
				<Content className={'content'}>
					<Card
						bordered
						ref={card => {
							if (card)
								card.container.scrollTop = card.container.scrollHeight
						}}
						className={'operator-messages'}>
						<div>
							{this.getMessages()}
						</div>
					</Card>
					{this.getChatForm()}
				</Content>
			</Layout>
		)
	}
}

const InitContent = Form.create()(CreateInitContent);

const mapStateToProps = state => ({
	messages: state.messages,
	status: state.activeStatus,
	selectedRoom: state.selectedRoom,
	clients: state.clients
})

const mapDispatchToProps = dispatch => ({
	sendMessage: (message) => dispatch(sendMessage(message)),
	closeChat: (room) => dispatch(closeChat(room)),
	receiveMessages: (messages) => dispatch(receiveMessages(messages)),
	changeRoomStatus: (room) => dispatch(changeRoomStatus(room))
})

const ChatContent = connect(
	mapStateToProps,
	mapDispatchToProps
)(InitContent);

export default ChatContent;

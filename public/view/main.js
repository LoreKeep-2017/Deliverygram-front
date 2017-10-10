'use strict';

import React from 'react'
import {
	Layout,
	Menu,
	Card,
	Form,
	Input,
	Button
} from 'antd';
import {connect} from 'react-redux';
import Socket from '../models/socket';
import {receiveClients, sendMessage, closeChat, receiveMessages, enterRoom, changeRoomStatus} from './action';
import './main.less';
import MenuItems from '../components/menuItems';

const {
	Header,
	Content,
	Footer,
	Sider
} = Layout;

class MainView extends React.Component {

	constructor() {
		super();
		this.state = {
			collapsed: false,
		};
		this.toggle = () => {
			this.setState({
				collapsed: !this.state.collapsed,
			});
		}
	}

	componentDidMount() {
		const {
			receiveClients,
			receiveMessages,
			changeRoomStatus
		} = this.props;
		this.socket = new Socket(receiveClients, receiveMessages, changeRoomStatus);
	}

	onClick() {
		const {
			sendMessage,
			form: {
				getFieldValue,
				resetFields
			},
			rid
		} = this.props;
		let message = getFieldValue('message');
		sendMessage(message, rid);
		resetFields();
		this.socket.sendWithBody('sendMessage', {
			room: rid,
			body: message,
			author: 'operator'
		})
	}

	getMessages() {
		const {
			messages
		} = this.props;
		let allMessages = [];
		if (messages) {
			messages.forEach(item => {
				allMessages.push(<div className={`${item.author}-message`}>{item.body}</div>)
			});
		}
		return allMessages;
	}

	onCloseChat() {
		const {
			closeChat,
			rid
		} = this.props;
		closeChat(room);
		this.socket.sendWithBody('closeRoom', {
			rid: rid
		})
	}

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<Layout>
				<Sider width={500} style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}>
					<MenuItems/>
				</Sider>
				<Layout style={{marginLeft: 500}}>
					<Header style={{background: '#fff', padding: 0, height: '10vh'}}>
						<Button onClick={() => this.onCloseChat()}>{'Закрыть чат'}</Button>
					</Header>
					<Content className={'content'}>
						<Card bordered className={'operator-messages'}>
							<div>
								{this.getMessages()}
							</div>
						</Card>
						<Form className={'operator-chat'}>
							<Form.Item style={{width: '100%'}}>
								{getFieldDecorator('message', {})(
									<Input.TextArea autosize={{minRows: 3, maxRows: 5}}
									                placeholder={'Введите свое сообщение'}
									                className={'operator-chat__input-form'}
									                onPressEnter={(event) => console.log(event)}/>
								)}
								<Button onClick={() => this.onClick()}>{'Отправить'}</Button>
							</Form.Item>
						</Form>
					</Content>
				</Layout>
			</Layout>
		);
	}
}

const mapStateToProps = state => {
	return {
		messages: state.messages,
		clients: state.clients,
		rid: state.rid
	}
}

const mapDispatchToProps = dispatch => {
	return {
		receiveClients: (clients) => dispatch(receiveClients(clients)),
		sendMessage: (message) => dispatch(sendMessage(message)),
		closeChat: (room) => dispatch(closeChat(room)),
		receiveMessages: (messages) => dispatch(receiveMessages(messages)),
		enterRoom: (rid) => dispatch(enterRoom(rid)),
		changeRoomStatus: (room) => dispatch(changeRoomStatus(room))
	}
}

const FullMainView = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(MainView));

export default FullMainView;

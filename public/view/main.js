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
import {receiveClients, sendMessage, closeChat, receiveMessages} from './action';
import './main.less';

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
			receiveMessages
		} = this.props;
		this.socket = new Socket(receiveClients, receiveMessages);
	}

	onClick() {
		const {
			sendMessage,
			form: {
				getFieldValue,
				resetFields
			}
		} = this.props;
		let message = getFieldValue('message');
		sendMessage(message);
		resetFields();
		this.socket.sendWithBody('sendMessage', {
			room: 1,
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
				allMessages.push(<div>{item.message}</div>)
			});
		}
		return allMessages;
	}

	getClientsRequests() {
		let {clients} = this.props;
        console.log(clients);
        let allClients = [];
		if (clients) {
			for (let keys in clients.rooms){
                console.log(clients.rooms)
                allClients.push(<Menu.Item style={{
				paddingLeft: 0,
				padding: 0,
				margin: '20px',
				height: 'auto',
				width: '80%',
			}}>
				{/*<Card title={'Возврат средств'} style={{width: '100%', height: '100%'}}>*/}
                <Button onClick={() => { console.log('onClick'); this.socket.sendWithBody('enterRoom', {rid: clients.rooms[keys].id})}}>
							{clients.rooms[keys].title}
				{/*</Card>*/}
                </Button>
			</Menu.Item>)
		}
    }
    return allClients;
	}

	onCloseChat() {
		const {
			closeChat
		} = this.props;
		closeChat(room);
		this.socket.sendWithBody('closeRoom', {
			rid: 1
		})
	}

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<Layout>
				<Sider width={300} style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}>
					<div className={'logo'}/>
					<Menu theme={'dark'} mode={'inline'} defaultSelectedKeys={['4']}>
						{this.getClientsRequests()}
					</Menu>
				</Sider>
				<Layout style={{marginLeft: 300}}>
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
		clients: state.clients
	}
}

const mapDispatchToProps = dispatch => {
	return {
			receiveClients: (clients) => dispatch(receiveClients(clients)),
			sendMessage: (message) => dispatch(sendMessage(message)),
			closeChat: (room) => dispatch(closeChat(room)),
			receiveMessages: (messages) => dispatch(receiveMessages(messages))
	}
}

const FullMainView = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(MainView));

export default FullMainView;

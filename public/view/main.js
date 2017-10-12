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
import MenuItems from '../components/menuItems/menuItems';
import ChatContent from '../components/content/content';

const {
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

	componentWillMount() {
		const {
			receiveClients,
			receiveMessages,
			changeRoomStatus
		} = this.props;
		this.socket = new Socket(receiveClients, receiveMessages, changeRoomStatus);
	}

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<Layout>
				<Sider width={500} style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}>
					<MenuItems socket={this.socket}/>
				</Sider>
				<ChatContent socket={this.socket}/>
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
		changeRoomStatus: (room) => dispatch(changeRoomStatus(room))
	}
}

const FullMainView = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(MainView));

export default FullMainView;

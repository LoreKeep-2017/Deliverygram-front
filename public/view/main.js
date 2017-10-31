'use strict';

import React from 'react'
import {
	Layout,
	Menu,
	Card,
	Form,
	Input,
	Button,
	Icon
} from 'antd';
import {connect} from 'react-redux';
import Socket from '../models/socket';
import {
	receiveClients, sendMessage, closeChat, receiveMessages, changeRoomStatus,
	getExtraInfo
} from './action';
import './main.less';
import MenuItems from '../components/menuItems/menuItems';
import ChatContent from '../components/content/content';
import MoreInfo from "../components/moreInfo/moreInfo";

const {
	Footer,
	Sider
} = Layout;

class MainView extends React.Component {

	constructor(){
		super();
		this.state = {};
		this.rightSiderClass = 'right-sider';
	}

	componentWillMount() {
		const {
			receiveClients,
			receiveMessages,
			changeRoomStatus
		} = this.props;
		this.socket = new Socket(receiveClients, receiveMessages, changeRoomStatus);
	}

	componentWillUpdate(nextProps, nextState) {
		const {
			getInfo,
			selectedRoom
		} = nextProps;
		if (selectedRoom && getInfo){
			this.rightSiderClass += ` right-sider__content`
		} else {
			this.rightSiderClass = 'right-sider';
		}
	}


	render() {
		const {
			form: {
				getFieldDecorator
			},
			getExtraInfo
		} = this.props;
		return (
			<Layout style={{width: '100vw'}}>
				<Sider className={'left-sider'} style={{maxWidth: 'none', minWidth: 'none'}}>
					<MenuItems socket={this.socket}/>
				</Sider>
				<ChatContent socket={this.socket}/>
				<Sider className={this.rightSiderClass}
				       collapsible={true}
					   ref={sider => this.rightSider = sider}
					   reverseArrow={true}
					   defaultCollapsed={true}
					   trigger={<Icon type="menu-fold" style={{fontSize: 24}}/>}
					   onCollapse={(collapsed, type) => getExtraInfo(!collapsed)}>
					<MoreInfo/>
				</Sider>
			</Layout>
		);
	}
}

const mapStateToProps = state => {
	return {
		messages: state.messages,
		clients: state.clients,
		rid: state.rid,
		getInfo: state.getInfo,
		selectedRoom: state.selectedRoom
	}
}

const mapDispatchToProps = dispatch => {
	return {
		receiveClients: (clients) => dispatch(receiveClients(clients)),
		sendMessage: (message) => dispatch(sendMessage(message)),
		closeChat: (room) => dispatch(closeChat(room)),
		receiveMessages: (messages) => dispatch(receiveMessages(messages)),
		changeRoomStatus: (room) => dispatch(changeRoomStatus(room)),
		getExtraInfo: (getInfo) => dispatch(getExtraInfo(getInfo))
	}
}

const FullMainView = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(MainView));

export default FullMainView;

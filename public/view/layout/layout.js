'use strict';
'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
	Layout,
	Menu,
	Card,
	Form,
	Input,
	Button,
	Icon
} from 'antd';
import Socket from '../../models/socket';
import {
	receiveClients, sendMessage, closeChat, receiveMessages, changeRoomStatus,
	getExtraInfo
} from '../action';
import '../main/main.less';
import MenuItems from '../../components/menuItems/menuItems';
import ChatContent from '../../components/content/content';
import MoreInfo from "../../components/moreInfo/moreInfo";


const {
	Footer,
	Sider
} = Layout;

class InitLayout extends React.Component {

	constructor() {
		super();
		this.state = {
			url: ''
		};
		this.rightSiderClass = 'right-sider';
	}

	componentWillMount() {
		const {
			receiveClients,
			receiveMessages,
			changeRoomStatus,
			selectedRoom,
			getInfo
		} = this.props;
		this.socket = new Socket(receiveClients, receiveMessages, changeRoomStatus);
		if (selectedRoom && getInfo) {
			this.rightSiderClass += ` right-sider__content`
		} else {
			this.rightSiderClass = 'right-sider';
		}
	}

	componentWillUpdate(nextProps, nextState) {
		const {
			getInfo,
			selectedRoom
		} = nextProps;
		if (selectedRoom && getInfo) {
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
			getExtraInfo,
			getInfo = false,
			path,
			selectedRoom,
			match
		} = this.props;
		let {
			url
		} = this.state;
		if (path && selectedRoom && !url) {
			url = `/${path}/${selectedRoom}/info`;
		}
		return (
			<Layout style={{width: '100vw'}}>
				<Sider className={'left-sider'} style={{maxWidth: 'none', minWidth: 'none'}}>
					<MenuItems socket={this.socket} path={path} match={match}/>
				</Sider>
				<ChatContent socket={this.socket}/>
				<Sider className={this.rightSiderClass}
				       collapsible={true}
				       reverseArrow={true}
				       defaultCollapsed={!getInfo}
				       trigger={
					       <Link to={url}>
						       <Icon type="menu-fold" style={{fontSize: 24}}/>
					       </Link>}
				       onCollapse={(collapsed, type) => {
					       getExtraInfo(!collapsed)
					       if (collapsed) {
						       this.setState({url: `/${path}/${selectedRoom}/info`});
					       } else {
						       this.setState({url: `/${path}/${selectedRoom}`});
					       }
				       }}>
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

const ChatLayout = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(InitLayout));

export default ChatLayout;

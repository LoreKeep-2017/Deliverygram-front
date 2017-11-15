'use strict';
'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
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
	receiveClients,
	sendMessage,
	closeChat,
	receiveMessages,
	changeRoomStatus,
	getExtraInfo, changeMessagesByStatus, selectRoom, receiveOperators, redirectDone
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
		this.rightSiderClass = 'right-sider';
	}

	componentDidMount() {
		const {
			match,
			status,
			changeMessagesByStatus,
			getExtraInfo,
			selectRoom
		} = this.props;
		changeMessagesByStatus(status);
		this.socket.sendWithBody('getRoomsByStatus', {
			type: status
		});
		if (match.path.indexOf('info') > -1) {
			getExtraInfo(true)
		}
		if (match.path.indexOf(':id') > -1) {
			this.socket.sendWithBody('getAllMessages', {
				rid: +match.params.id
			});
			selectRoom(match.params.id);
		}
	}

	componentWillMount() {
		const {
			receiveClients,
			receiveMessages,
			receiveOperators,
			changeRoomStatus,
			selectedRoom,
			getInfo,
			operatorInfo
		} = this.props;
		this.socket = new Socket({receiveClients, receiveMessages, receiveOperators, changeRoomStatus, operatorInfo});
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

	componentDidUpdate(prevProps, prevState) {
		const {
			changeMessagesByStatus,
			getExtraInfo,
			selectRoom,
			match,
			status,
			redirectFromInfo
		} = this.props;
		if (redirectFromInfo){
			return;
		}
		if (status !== prevProps.status)
			changeMessagesByStatus(status);
		if (match.path.indexOf('info') > -1) {
			getExtraInfo(true)
		}
		if (match.path.indexOf(':id') > -1) {
			selectRoom(match.params.id);
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
			match,
			signRedirect,
			redirectFromInfo,
			redirectDone
		} = this.props;
		let url, sider;
		if (signRedirect) {
			return <Redirect to={'/signin'}/>
		}
		if (redirectFromInfo){
			redirectDone();
			return <Redirect to={'/active-messages'}/>
		}
		if (path && selectedRoom) {
			if (!getInfo) {
				url = `/${path}/${selectedRoom}/info`;
			} else {
				url = `/${path}/${selectedRoom}`;
			}
			sider = (
				<Sider className={this.rightSiderClass}
				       collapsible={true}
				       defaultCollapsed={!getInfo}
				       trigger={null}>
					<Link to={url} onClick={(collapsed) => getExtraInfo(!collapsed)}>
						<div className={'right_sider__trigger'}>
							<Icon type={getInfo ? 'menu-unfold' : 'menu-fold'} style={{fontSize: 24}}/>
						</div>
					</Link>
					<MoreInfo socket={this.socket}/>
				</Sider>)
		}
		return (
			<Layout style={{width: '100vw'}}>
				<Sider className={'left-sider'} style={{maxWidth: 'none', minWidth: 'none'}}>
					<MenuItems socket={this.socket} path={path} match={match}/>
				</Sider>
				<ChatContent socket={this.socket}/>
				{sider}
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
		selectedRoom: state.selectedRoom,
		operatorInfo: state.operatorInfo,
		signRedirect: state.loginStatuses.signRedirect,
		redirectFromInfo: state.redirectFromInfo
	}
}

const mapDispatchToProps = dispatch => {
	return {
		receiveClients: (clients) => dispatch(receiveClients(clients)),
		sendMessage: (message) => dispatch(sendMessage(message)),
		closeChat: (room) => dispatch(closeChat(room)),
		receiveMessages: (messages) => dispatch(receiveMessages(messages)),
		changeRoomStatus: (room) => dispatch(changeRoomStatus(room)),
		getExtraInfo: (getInfo) => dispatch(getExtraInfo(getInfo)),
		changeMessagesByStatus: (status) => dispatch(changeMessagesByStatus(status)),
		selectRoom: (rid) => dispatch(selectRoom(rid)),
		receiveOperators: (operators) => dispatch(receiveOperators(operators)),
		redirectDone: () => dispatch(redirectDone())
	}
}

const ChatLayout = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(InitLayout));

export default ChatLayout;

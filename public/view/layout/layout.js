'use strict';
'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {
	Layout,
	Form,
	Row,
	Popover,
	Icon,
	Button
} from 'antd';
import Socket from '../../models/socket';
import {
	receiveClients,
	sendMessage,
	closeChat,
	receiveMessages,
	changeRoomStatus,
	getExtraInfo,
	changeMessagesByStatus,
	selectRoom,
	receiveOperators,
	redirectDone, updateInfo
} from '../action';
import '../main/main.less';
import MenuItems from '../../components/menuItems/menuItems';
import ChatContent from '../../components/content/content';
import MoreInfo from "../../components/moreInfo/moreInfo";
import ChatHeader from "../../components/header/chatHeader";

const {
	Header,
	Sider,
	Content
} = Layout;

class InitLayout extends React.Component {

	constructor() {
		super();
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
			operatorInfo,
			updateInfo
		} = this.props;
		this.socket = new Socket({
			receiveClients,
			receiveMessages,
			receiveOperators,
			changeRoomStatus,
			updateInfo,
			operatorInfo
		});
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
		if (redirectFromInfo) {
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
			path,
			match,
			signRedirect,
			redirectFromInfo,
			redirectDone,
			operatorInfo,
		} = this.props;
		if (signRedirect) {
			return <Redirect to={'/signin'}/>
		}
		if (redirectFromInfo) {
			redirectDone();
			return <Redirect to={'/active-messages'}/>
		}
		return (
			<Layout style={{width: '100vw'}}>
				<Header>
					<ChatHeader socket={this.socket} match={match}/>
				</Header>
				<section className={'main-content'}>
					<Sider className={'left-sider'}>
						<MenuItems socket={this.socket} path={path} match={match}/>
					</Sider>
					<ChatContent className={'main-content__chat-content'} socket={this.socket}/>
					<Sider className={'right-sider right-sider__content'}>
						<MoreInfo socket={this.socket}/>
					</Sider>
				</section>
			</Layout>
		)
			;
	}
}

const mapStateToProps = state => {
	return {
		messages: state.messages,
		clients: state.clients,
		rid: state.rid,
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
		redirectDone: () => dispatch(redirectDone()),
	}
}

const ChatLayout = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(InitLayout));

export default ChatLayout;

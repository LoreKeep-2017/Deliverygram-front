'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {
	Layout,
	Button,
	Row
} from 'antd'
import {
	changeRoomStatus,
	closeChat,
	enterRoom
} from '../../view/action';
import './chatHeader.less'

const {
	Header
} = Layout;

class InitChatHeader extends React.Component {

	changeToChat() {
		const {
			enterRoom,
			socket,
			selectedRoom
		} = this.props;
		enterRoom(selectedRoom);
		socket.sendWithBody('enterRoom', {rid: +selectedRoom});
	}

	onCloseChat() {
		const {
			closeChat,
			selectedRoom,
			socket
		} = this.props;
		closeChat(selectedRoom);
		socket.sendWithBody('closeRoom', {
			rid: +selectedRoom
		})
	}

	getMainHeaderContent() {
		const {
			status,
			clients,
			selectedRoom
		} = this.props;
		if (selectedRoom && clients && clients.rooms && clients.rooms[selectedRoom] && clients.rooms[selectedRoom].client) {
			let button;
			switch (status) {
				case 'roomNew':
					button = (
						<Link to={`/active-messages/${selectedRoom}`}>
							<Button className={'action-button'} onClick={() => this.changeToChat()}>
								{'Забрать'}
							</Button>
						</Link>);
					break;
			}
			return (<Row className={'header'}>
				<div className={'header__info'}>
					<span className={'info__author'}>{`${clients.rooms[selectedRoom].client.nick || 'Аноним'}`}</span>
					<span className={'info__title'}>{`${clients.rooms[selectedRoom].description || clients.rooms[selectedRoom].lastMessage}`}</span>
				</div>
				<div className={'header__actions'}>
					{button}
				</div>
			</Row>)
		} else {
			return <Row/>
		}
	}

	render() {
		return (
			<Header style={{background: '#fff', padding: 0, height: '10vh'}}>
				{this.getMainHeaderContent()}
			</Header>
		)
	}
}

const mapStateToProps = state => ({
	clients: state.clients,
	rid: state.rid,
	status: state.activeStatus,
	selectedRoom: state.selectedRoom
})

const mapDispatchToProps = dispatch => ({
	closeChat: (room) => dispatch(closeChat(room)),
	enterRoom: (room) => dispatch(enterRoom(room)),
	changeRoomStatus: (room) => dispatch(changeRoomStatus(room))
})

const ChatHeader = connect(
	mapStateToProps,
	mapDispatchToProps
)(InitChatHeader);

export default ChatHeader;
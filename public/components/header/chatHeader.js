'use strict';

import React from 'react';
import {connect} from 'react-redux';
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
		socket.sendWithBody('enterRoom', {rid: selectedRoom});
	}

	onCloseChat() {
		const {
			closeChat,
			selectedRoom,
			socket
		} = this.props;
		closeChat(selectedRoom);
		socket.sendWithBody('closeRoom', {
			rid: selectedRoom
		})
	}

	getMainHeaderContent() {
		const {
			status,
			clients,
			selectedRoom
		} = this.props;
		if (selectedRoom) {
			let button;
			switch (status) {
				case 'roomNew':
					button = <Button className={'action-button'} onClick={() => this.changeToChat()}>{'Забрать'}</Button>;
					break;
				case 'roomBusy':
					button = <Button className={'action-button'}  onClick={() => this.onCloseChat()}>{'Закрыть'}</Button>;
					break;
			}
			return (<Row className={'header'}>
				<div className={'header__info'}>
					<div className={'info__title'}>{`Проблема: ${clients.rooms[selectedRoom].title}`}</div>
					<div className={'info__description'}>{`Описание: ${clients.rooms[selectedRoom].description}`}</div>
					<div className={'info__author'}>{`Автор: ${clients.rooms[selectedRoom].client.nick}`}</div>
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
'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Link, Redirect} from 'react-router-dom';
import {
	Layout,
	Button,
	Row,
	Icon,
	Popover,
	Tabs,
	Col
} from 'antd'
import {
	changeMessagesByStatus,
	changeRoomStatus,
	closeChat,
	enterRoom, removeSendedFlag
} from '../../view/action';
import './chatHeader.less'
import {axiosGet} from "../../models/axios";

const {
	Header
} = Layout;

class InitChatHeader extends React.Component {

	constructor() {
		super();
		this.state = {
			selectedRoom: -1,
			event: ''
		}
	}

	changeToChat() {
		const {
			enterRoom,
			socket,
			selectedRoom
		} = this.props;
		enterRoom(selectedRoom);
		socket.sendWithBody('enterRoom', {rid: +selectedRoom});
	}

	getPopoverContent() {
		return (
			<Button onClick={() => this.logout()}>
				{'Выход'}
			</Button>
		)
	}

	logout() {
		const {
			logoutSuccess,
			logoutFailed
		} = this.props;
		axiosGet({path: '/logout/'})
			.then(response => {
				logoutSuccess();
			})
			.catch(error => {
				console.info(error);
				logoutFailed();
			});
	}

	getMainHeaderContent() {
		const {
			status,
			clients,
			selectedRoom,
		} = this.props;
		if (selectedRoom && clients && clients.rooms && clients.rooms[selectedRoom] && clients.rooms[selectedRoom].client) {
			let button;
			switch (status) {
				case 'roomNew':
					button = (
						<Link to={`/active-messages/${selectedRoom}`} onClick={() => this.changeToChat()}>
							<Button className={'action-button'}>
								{'Забрать'}
							</Button>
						</Link>);
					break;
			}
			return (<Row className={'header'}>
				<div className={'header__info'}>
					<span className={'info__author'}>{`${clients.rooms[selectedRoom].client.nick || 'Аноним'}`}</span>
					<span
						className={'info__title'}>{`${clients.rooms[selectedRoom].description || clients.rooms[selectedRoom].lastMessage}`}</span>
				</div>
				<div className={'header__actions'}>
					{button}
				</div>
			</Row>)
		} else {
			return <Row/>
		}
	}

	componentDidMount() {
		const {
			activeStatus,
			selectedRoom,
			socket,
			match,
		} = this.props;
		if (activeStatus) {
			socket.sendWithBody('getRoomsByStatus', {type: activeStatus});
		}
		if (selectedRoom) {
			socket.sendWithBody('getAllMessages', {rid: +selectedRoom});
		}
		if (selectedRoom && activeStatus === 'roomRecieved' && this.state.selectedRoom !== +selectedRoom) {
			this.setState({selectedRoom: +selectedRoom})
		}
	}

	componentDidUpdate() {
		const {
			selectedRoom,
			activeStatus
		} = this.props;
		if (selectedRoom && activeStatus === 'roomRecieved' && this.state.selectedRoom !== +selectedRoom) {
			this.setState({
				selectedRoom: +selectedRoom,
				event: ''
			})
		} else if (this.state.event) {
			this.setState({event: ''});
		}
	}

	changeMessages(event) {
		const {
			socket,
		} = this.props;
		switch (event) {
			case 'new-messages':
				socket.sendWithBody('getRoomsByStatus', {type: 'roomNew'});
				break;
			case 'active-messages':
				socket.sendWithBody('getRoomsByStatus', {type: 'roomRecieved'});
				break;
			case 'closed-messages':
				socket.sendWithBody('getRoomsByStatus', {type: 'roomSend'});
				break;
		}
	}

	getMainMenu() {
		let menu = [];
		menu.push(
			<Tabs.TabPane key={'new-messages'} className={'main-menu-item'}
			              tab={<p className={'tab__link'}>{'Входящие'}</p>} forceRender={true}
			              style={{paddingLeft: 0, padding: 0, height: '12vh'}}/>);
		menu.push(
			<Tabs.TabPane key={'active-messages'} className={'main-menu-item'}
			              tab={<p className={'tab__link'}>{'Принятые'}</p>} forceRender={true}
			              style={{paddingLeft: 0, padding: 0, height: '12vh'}}/>);
		menu.push(
			<Tabs.TabPane key={'closed-messages'} className={'main-menu-item'}
			              tab={<p className={'tab__link'}>{'Обработанные'}</p>} forceRender={true}
			              style={{paddingLeft: 0, padding: 0, height: '12vh'}}/>);
		return menu;
	}

	render() {
		const {
			operatorInfo,
			sended,
			socket,
			removeSendedFlag,
			changeMessagesByStatus,
			match
		} = this.props;
		let activeKey;
		if (this.state.event) {
			return <Redirect to={`/${this.state.event}`}/>
		}
		if (match.url.indexOf('/', 1) > -1) {
			activeKey = match.url.slice(1, match.url.indexOf('/', 1));
		} else {
			activeKey = match.url.slice(1);
		}
		return (
			<section>
				<Row className={'header'}>
					<Col className={'header__company'}>
						<p className={'header__company_name'}>{'Технопарк'}</p>
					</Col>
					<Col className={'header__links'}>
						<Tabs activeKey={activeKey}
						      onChange={(event) => {
							if (sended) {
								socket.sendWithBody('roomStatusSend', {rid: +this.state.selectedRoom});
								removeSendedFlag();
							}
							changeMessagesByStatus(event);
							this.changeMessages(event);
							this.setState({event})
						}}>
							{this.getMainMenu()}
						</Tabs>
					</Col>

					<Col className={'header__user'}>
						<div className={'user-info__info'}>
							<Icon type={'user'} className={'user-info__user-icon'}/>
							<span className={'user-info__user-info'}>{operatorInfo.fio}</span>
							<Popover className={'user-info__exit-icon'} content={this.getPopoverContent()}>
								<Icon type="down"/>
							</Popover>

						</div>
					</Col>
				</Row>
				{/*{this.getMainHeaderContent()}*/}
			</section>
		)
	}
}

const mapStateToProps = state => ({
	clients: state.clients,
	rid: state.rid,
	status: state.activeStatus,
	selectedRoom: state.selectedRoom,
	operatorInfo: state.operatorInfo,
	sended: state.sended

})

const mapDispatchToProps = dispatch => ({
	closeChat: (room) => dispatch(closeChat(room)),
	enterRoom: (room) => dispatch(enterRoom(room)),
	changeRoomStatus: (room) => dispatch(changeRoomStatus(room)),
	changeMessagesByStatus: (status) => dispatch(changeMessagesByStatus(status)),
	removeSendedFlag: () => dispatch(removeSendedFlag())
})

const ChatHeader = connect(
	mapStateToProps,
	mapDispatchToProps
)(InitChatHeader);

export default ChatHeader;
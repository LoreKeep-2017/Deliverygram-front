'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {
	Menu,
	Button,
	Row,
	Col
} from 'antd';
import './menuItems.less';
import {
	changeMessagesByStatus,
	enterRoom,
	getExtraInfo,
	selectRoom
} from '../../view/action';

class MenuInit extends React.Component {

	getInitials(nick) {
		if (nick.length === 1) {
			return nick;
		}
		return (nick.indexOf(' ') === -1 ) ? nick[0] + nick[1] : nick[0] + nick[nick.indexOf(' ') + 1];
	}

	componentDidMount() {
		const {
			activeStatus,
			selectedRoom,
			socket
		} = this.props;
		if (activeStatus){
			socket.sendWithBody('getRoomsByStatus', {type: activeStatus});
		}
		if (selectedRoom){
			socket.sendWithBody('getAllMessages', {rid: +selectedRoom});
		}
	}

	getClientsRequests() {
		let {
			clients,
			newMessages,
			path
		} = this.props;
		let allClients = [];
		if (clients) {
			for (let keys in clients.rooms) {
				let newMessage = newMessages[keys] ? `+${newMessages[keys]}` : '';
				allClients.push(
					<Menu.Item style={{
						paddingLeft: 0,
						padding: 0,
						height: '9vh'
					}} className={'client-menu-item'} key={clients.rooms[keys].id.toString()}>
						<Link to={`/${path}/${keys}`}>
							<Row className={'client-menu-item__client-row'}>
								<Col className={'client-row__avatar-div'}>
									<div className={'client-row__avatar'}>
										{this.getInitials(clients.rooms[keys].client.nick).toUpperCase()}
									</div>
								</Col>
								<Col className={'client-row__content-col'}>
									<h1>{clients.rooms[keys].client.nick}</h1>
									<span className={'content-col__title'}>{clients.rooms[keys].title}</span>
								</Col>
								<Col>
							<span className={'client-row__new-messages-col'}>
								{newMessage}
							</span>
								</Col>
							</Row>
						</Link>
					</Menu.Item>
				)
			}
		}
		return allClients;
	}

	getMainMenu() {
		let menu = [];
		menu.push(
			<Menu.Item key={'new-messages'} className={'main-menu-item'} style={{paddingLeft: 0, padding: 0, height: '12vh'}}>
				<Link to={'/new-messages'}>
					<Button shape={'circle'} icon={'mail'} key={'mail-button'} size={'large'}/>
				</Link>
			</Menu.Item>);
		menu.push(
			<Menu.Item key={'active-messages'} className={'main-menu-item'}
			           style={{paddingLeft: 0, padding: 0, height: '12vh'}}>
				<Link to={'/active-messages'}>
					<Button shape={'circle'} icon={'exception'} key={'exception-button'} size={'large'}/>
				</Link>
			</Menu.Item>);
		menu.push(
			<Menu.Item key={'closed-messages'} className={'main-menu-item'} style={{paddingLeft: 0, padding: 0, height: '12vh'}}>
				<Link to={'/closed-messages'}>
					<Button shape={'circle'} icon={'inbox'} key={'inbox-button'} size={'large'}/>
				</Link>
			</Menu.Item>);
		return menu;
	}

	changeMessages(event) {
		const {
			socket,
			getExtraInfo
		} = this.props;
		switch (event.key) {
			case 'new-messages':
				getExtraInfo(false);
				socket.sendWithBody('getRoomsByStatus', {type: 'roomNew'});
				break;
			case 'active-messages':
				getExtraInfo(false);
				socket.sendWithBody('getRoomsByStatus', {type: 'roomBusy'});
				break;
			case 'closed-messages':
				getExtraInfo(false);
				socket.sendWithBody('getRoomsByStatus', {type: 'roomClose'});
				break;
		}
	}

	getTitle() {
		const {
			activeStatus
		} = this.props;
		switch (activeStatus) {
			case 'roomNew':
				return 'Новые';
			case 'roomBusy':
				return 'В обработке';
			case 'roomClose':
				return 'Закрытые'
		}
	}

	render() {
		const {
			socket,
			selectRoom,
			path,
			getExtraInfo,
			match = {params: {}}
		} = this.props;
		return (
			<div className={'logo'} style={{display: 'flex'}}>
				<div style={{background: 'white', minWidth: '6vw', height: '100vh'}}>
					<Menu theme={'light'} mode={'inline'}
					      selectedKeys={[path]}
					      onSelect={(event) => this.changeMessages(event)}>
						{this.getMainMenu()}
					</Menu>
				</div>
				<div style={{width: '22vw'}}>
					<span className={'menu-title'}>
						{this.getTitle()}
					</span>
					<Menu theme={'dark'} mode={'inline'}
					      className={'client-menu'}
					      selectedKeys={[match.params.id]}
					      onClick={(event) => {
						      selectRoom(+event.key);
						      getExtraInfo(false);
						      socket.sendWithBody('getAllMessages', {rid: +event.key});
					      }}>
						{this.getClientsRequests()}
					</Menu>
				</div>
			</div>)
	}
}

const mapStateToProps = state => ({
	messages: state.messages,
	clients: state.clients,
	rid: state.rid,
	activeStatus: state.activeStatus,
	selectedRoom: state.selectedRoom,
	newMessages: state.newMessages
});

const mapDispatchToProps = dispatch => ({
	changeMessagesByStatus: (status) => dispatch(changeMessagesByStatus(status)),
	enterRoom: (rid) => dispatch(enterRoom(rid)),
	selectRoom: (rid) => dispatch(selectRoom(rid)),
	getExtraInfo: (getInfo) => dispatch(getExtraInfo(getInfo))
});

const MenuItems = connect(
	mapStateToProps,
	mapDispatchToProps
)(MenuInit);

export default MenuItems;
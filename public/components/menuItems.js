'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {
	Menu,
	Button,
	Row,
	Col
} from 'antd';
import './menuItems.less';
import {changeMessagesByStatus, enterRoom} from "../view/action";

class MenuInit extends React.Component {

	getInitials(nick){
		return (nick.indexOf(' ') === -1 ) ? nick[0] + nick[1] : nick[0] + nick[nick.indexOf(' ') + 1];
	}

	getClientsRequests() {
		let {clients, enterRoom} = this.props;
		let allClients = [];
		if (clients) {
			for (let keys in clients.rooms) {
				allClients.push(<Menu.Item style={{
					paddingLeft: 0,
					padding: 0,
					height: '9vh'
				}} className={'client-menu-item'} key={clients.rooms[keys].id}>
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
					</Row>
				</Menu.Item>)
			}
		}
		return allClients;
	}

	getMainMenu() {
		let menu = [];
		menu.push(
			<Menu.Item key={'mail'} className={'main-menu-item'} style={{paddingLeft: 0, padding: 0, height: '12vh'}}>
				<Button shape={'circle'} icon={'mail'} key={'mail-button'} size={'large'}/>
			</Menu.Item>);
		menu.push(
			<Menu.Item key={'exception'} className={'main-menu-item'}
			           style={{paddingLeft: 0, padding: 0, height: '12vh'}}>
				<Button shape={'circle'} icon={'exception'} key={'exception-button'} size={'large'}/>
			</Menu.Item>);
		menu.push(
			<Menu.Item key={'inbox'} className={'main-menu-item'} style={{paddingLeft: 0, padding: 0, height: '12vh'}}>
				<Button shape={'circle'} icon={'inbox'} key={'inbox-button'} size={'large'}/>
			</Menu.Item>);
		return menu;
	}

	changeMessages(event){
		const {
			changeMessagesByStatus,
			socket
		} = this.props;
		switch (event.key){
			case 'mail':
				changeMessagesByStatus('roomNew');
				socket.sendWithBody('getRoomsByStatus', {type: 'roomNew'});
				break;
			case 'exception':
				changeMessagesByStatus('roomBusy');
				socket.sendWithBody('getRoomsByStatus', {type: 'roomBusy'});
				break;
			case 'inbox':
				changeMessagesByStatus('roomClose');
				socket.sendWithBody('getRoomsByStatus', {type: 'roomClose'});
				break;
		}
	}

	changeToChat(event){
		const{
			enterRoom,
			socket
		} = this.props;
		enterRoom(+event.key);
		socket.sendWithBody('enterRoom', {rid: +event.key});
		socket.sendWithBody('getAllMessages', {rid: +event.key});
	}

	getTitle(){
		const {
			activeStatus
		} = this.props;
		switch (activeStatus){
			case 'roomNew':
				return 'Новые';
			case 'roomBusy':
				return 'В обработке';
			case 'roomClose':
				return 'Закрытые'
		}
	}

	render() {
		return (
			<div className={'logo'} style={{display: 'flex'}}>
				<div style={{background: 'white', width: 100, height: '100vh'}}>
					<Menu theme={'light'} mode={'inline'}
					      onSelect={(event) => this.changeMessages(event)}>
						{this.getMainMenu()}
					</Menu>
				</div>
				<div>
					<span className={'menu-title'}>
						{this.getTitle()}
					</span>
					<Menu theme={'dark'} mode={'inline'} className={'client-menu'} onClick={(event) => this.changeToChat(event)}>
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
	activeStatus: state.activeStatus
});

const mapDispatchToProps = dispatch => ({
	changeMessagesByStatus: (status) => dispatch(changeMessagesByStatus(status)),
	enterRoom: (rid) => dispatch(enterRoom(rid))
});

const MenuItems = connect(
	mapStateToProps,
	mapDispatchToProps
)(MenuInit);

export default MenuItems;
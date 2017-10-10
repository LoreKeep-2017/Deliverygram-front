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

class MenuInit extends React.Component {

	getClientsRequests() {
		let {clients, enterRoom} = this.props;
		let allClients = [];
		if (clients) {
			for (let keys in clients.rooms) {
				allClients.push(<Menu.Item style={{
					paddingLeft: 0,
					padding: 0,
					height: '9vh'
				}} className={'client-menu-item'}>
					{/*<Button onClick={() => {*/}
					{/*enterRoom(clients.rooms[keys].id);*/}
					{/*this.socket.sendWithBody('enterRoom', {rid: clients.rooms[keys].id})*/}
					{/*this.socket.sendWithBody('getAllMessages', {rid: clients.rooms[keys].id})*/}
					{/*}}>*/}
					{/*{clients.rooms[keys].title}*/}
					{/*</Button>*/}
					<Row className={'client-menu-item__client-row'}>
						<Col className={'client-row__avatar-div'}>
							<div className={'client-row__avatar'}/>
						</Col>
						<Col className={'client-row__content-col'}>
								<h1></h1>
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

	render() {
		return (
			<div className={'logo'} style={{display: 'flex'}}>
				<div style={{background: 'white', width: 100, height: '100vh'}}>
					<Menu theme={'light'} mode={'inline'}
					      onSelect={(event, label) => console.log('tapped', event, label)}>
						{this.getMainMenu()}
					</Menu>
				</div>
				<div>
					<Menu theme={'dark'} mode={'inline'} defaultSelectedKeys={['4']} className={'client-menu'}>
						{this.getClientsRequests()}
					</Menu>
				</div>
			</div>)
	}
}

const mapStateToProps = state => ({
	messages: state.messages,
	clients: state.clients,
	rid: state.rid
});

const mapDispatchToProps = dispatch => ({});

const MenuItems = connect(
	mapStateToProps,
	mapDispatchToProps()
)(MenuInit);

export default MenuItems;
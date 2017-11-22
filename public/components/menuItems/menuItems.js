'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {
	Menu,
	Button,
	Row,
	Col,
	Icon,
	Popover,
	Form,
	Input
} from 'antd';
import './menuItems.less';
import {
	changeMessagesByStatus,
	enterRoom,
	getExtraInfo, infoSearch, logoutFailed, logoutSuccess, removeSendedFlag,
	selectRoom
} from '../../view/action';
import {axiosGet} from "../../models/axios";

class MenuInit extends React.Component {

	constructor() {
		super();
		this.state = {
			selectedRoom: -1
		}
	}

	getInitials(nick) {
		if (!nick)
			return '';
		if (nick.length === 1) {
			return nick;
		}
		return (nick.indexOf(' ') === -1 ) ? nick[0] + nick[1] : nick[0] + nick[nick.indexOf(' ') + 1];
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
			this.setState({selectedRoom: +selectedRoom})
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
						<Link to={`/${path}/${keys}`} className={'client-menu-item__href'}>
							<Row className={'client-menu-item__client-row'}>
								<Col className={'client-row__avatar-div'}>
									{this.getAvatar(keys)}
								</Col>
								<Col className={'client-row__content-col'}>
									<h1>{clients.rooms[keys].client.nick || 'Аноним'}</h1>
									<span className={'content-col__title'}>{clients.rooms[keys].lastMessage}</span>
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

	getAvatar(keys) {
		const {
			clients
		} = this.props;
		if (clients.rooms[keys].client.nick) {
			return <div className={'client-row__avatar'}>
				{this.getInitials(clients.rooms[keys].client.nick).toUpperCase()}
			</div>
		}
		return <Icon style={{fontSize: '2.5em', color: 'white'}} type="question" />
	}

	getPopoverContent() {
		return (
			<Button onClick={() => this.logout()}>
				{'Выход'}
			</Button>
		)
	}

	getMainMenu() {
		let menu = [];
		menu.push(
			<Menu.Item key={'new-messages'} className={'main-menu-item'}
			           style={{paddingLeft: 0, padding: 0, height: '12vh'}}>
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
			<Menu.Item key={'closed-messages'} className={'main-menu-item'}
			           style={{paddingLeft: 0, padding: 0, height: '12vh'}}>
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
				socket.sendWithBody('getRoomsByStatus', {type: 'roomRecieved'});
				break;
			case 'closed-messages':
				getExtraInfo(false);
				socket.sendWithBody('getRoomsByStatus', {type: 'roomSend'});
				break;
		}
	}

	getTitle() {
		const {
			activeStatus
		} = this.props;
		console.info(activeStatus);
		switch (activeStatus) {
			case 'roomNew':
				return 'Новые';
			case 'roomRecieved':
				return 'В обработке';
			case 'roomSend':
				return 'В ожидании';
		}
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

	search(){
		const{
			form:{
				getFieldValue
			},
			socket,
			activeStatus,
			infoSearch
		} = this.props;
		let searchTag = getFieldValue('search');
		infoSearch();
		socket.sendWithBody('search', {
			type: activeStatus,
			pattern: `%${searchTag}%`
		})
	}

	resetField() {
		const {
			form: {
				resetFields
			}
		} = this.props;
		resetFields(['search']);
	}

	render() {
		const {
			socket,
			selectRoom,
			path,
			getExtraInfo,
			match = {params: {}},
			operatorInfo,
			activeStatus,
			sended,
			removeSendedFlag,
			form: {
				getFieldDecorator
			}
		} = this.props;
		return (
			<div>
				<Row className={'user-info'}>
					<div className={'user-info__group-icon'}/>
					<div className={'user-info__info'}>
						<Icon type={'user'} className={'user-info__user-icon'}/>
						<span className={'user-info__user-info'}>{operatorInfo.fio}</span>
						<Popover className={'user-info__exit-icon'} content={this.getPopoverContent()}>
							<Icon type="down"/>
						</Popover>

					</div>
				</Row>
				<div className={'logo'}>
					<div style={{background: 'white', minWidth: '6vw', height: '93vh', marginTop: '2px'}}>
						<Menu theme={'light'} mode={'inline'}
						      selectedKeys={[path]}
						      onSelect={(event) =>{
							      if (sended) {
								      socket.sendWithBody('roomStatusSend', {rid: +this.state.selectedRoom});
								      removeSendedFlag();
							      }
							      this.changeMessages(event)}}>
							{this.getMainMenu()}
						</Menu>
					</div>
					<div style={{width: '22vw'}}>
					<span className={'menu-title'}>
						{this.getTitle()}
					</span>
						<Form className={'search-form'}>
							<Form.Item>
								{getFieldDecorator('search', {initialValue: ''})(
									<Input className={'input-search'} placeholder={'Поиск ...'} onPressEnter={() => this.search()}/>
								)}
							</Form.Item>
							<Icon type='close-circle-o' className={'clear-icon'} onClick={() => this.resetField()}/>
						</Form>
						<Menu theme={'dark'} mode={'inline'}
						      className={'client-menu'}
						      selectedKeys={[match.params.id]}
						      onSelect={(event) => {
							      if (sended) {
								      socket.sendWithBody('roomStatusSend', {rid: +this.state.selectedRoom});
								      removeSendedFlag();
							      }
							      if (activeStatus === 'roomRecieved' && this.state.selectRoom !== +event.key) {
								      this.setState({selectedRoom: +event.key})
							      }
							      selectRoom(+event.key);
							      getExtraInfo(false);
							      socket.sendWithBody('getAllMessages', {rid: +event.key});
						      }}>
							{this.getClientsRequests()}
						</Menu>
					</div>
				</div>
			</div>)
	}
}

const MenuFormInit = Form.create()(MenuInit);

const mapStateToProps = state => ({
	messages: state.messages,
	clients: state.clients,
	rid: state.rid,
	activeStatus: state.activeStatus,
	selectedRoom: state.selectedRoom,
	newMessages: state.newMessages,
	operatorInfo: state.operatorInfo,
	sended: state.sended
});

const mapDispatchToProps = dispatch => ({
	changeMessagesByStatus: (status) => dispatch(changeMessagesByStatus(status)),
	enterRoom: (rid) => dispatch(enterRoom(rid)),
	selectRoom: (rid) => dispatch(selectRoom(rid)),
	getExtraInfo: (getInfo) => dispatch(getExtraInfo(getInfo)),
	logoutSuccess: () => dispatch(logoutSuccess()),
	logoutFailed: () => dispatch(logoutFailed()),
	removeSendedFlag: () => dispatch(removeSendedFlag()),
	infoSearch: () => dispatch(infoSearch())
});

const MenuItems = connect(
	mapStateToProps,
	mapDispatchToProps
)(MenuFormInit);

export default MenuItems;
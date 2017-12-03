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
	Form,
	Input
} from 'antd';
import './menuItems.less';
import {
	changeMessagesByStatus,
	enterRoom,
	getExtraInfo,
	infoSearch,
	logoutFailed,
	logoutSuccess,
	selectRoom
} from '../../view/action';

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
		return <Icon style={{fontSize: '2.5em', color: 'white'}} type="question"/>
	}

	search() {
		const {
			form: {
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
			activeStatus,
			sended,
			removeSendedFlag,
			form: {
				getFieldDecorator
			}
		} = this.props;
		return (
			<div>
				<div className={'logo'}>

					<Form className={'search-form'}>
						<Form.Item>
							{getFieldDecorator('search', {initialValue: ''})(
								<Input className={'input-search'} placeholder={'Поиск ...'}
								       onPressEnter={() => this.search()}/>
							)}
						</Form.Item>
						<Button icon={'close-circle-o'} className={'clear-icon'} onClick={() => this.resetField()}/>
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
});

const mapDispatchToProps = dispatch => ({
	changeMessagesByStatus: (status) => dispatch(changeMessagesByStatus(status)),
	enterRoom: (rid) => dispatch(enterRoom(rid)),
	selectRoom: (rid) => dispatch(selectRoom(rid)),
	getExtraInfo: (getInfo) => dispatch(getExtraInfo(getInfo)),
	logoutSuccess: () => dispatch(logoutSuccess()),
	logoutFailed: () => dispatch(logoutFailed()),
	infoSearch: () => dispatch(infoSearch())
});

const MenuItems = connect(
	mapStateToProps,
	mapDispatchToProps
)(MenuFormInit);

export default MenuItems;
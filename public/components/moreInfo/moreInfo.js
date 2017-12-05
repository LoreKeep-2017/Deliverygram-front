'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import './moreinfo.less'
import {
	Row,
	Button,
	Select,
	Form,
	Input
} from 'antd';
import {
	cancelOperatorChange, changeMessagesByStatus,
	chooseNewOperator, enterRoom,
	updateNote
} from '../../view/action';
import Twemoji from 'react-twemoji';
import moment from 'moment';
import _ from 'lodash';

class moreInfoInit extends React.Component {

	constructor() {
		super();
		this.state = {
			disabled: true
		}
	}

	changeOperator() {
		const {
			clients,
			chooseNewOperator,
			chooseOperator,
			socket,
			selectedRoom,
			operators,
			form: {
				getFieldDecorator
			},
			cancelOperatorChange,
			activeStatus,
			operatorInfo
		} = this.props;
		if (clients.rooms && clients.rooms[selectedRoom] && activeStatus !== 'roomNew') {
			if (chooseOperator && operators) {
				let options = operators.map(item => {
					if (operatorInfo.fio !== item.fio) {
						return <Select.Option value={`${item.id}`}
						                      key={`operator_${item.id}`}>{item.fio}</Select.Option>
					}
				});
				return (
					<Form className={'operator-info'}>
						<Form.Item className={'operator-info__select'}>
							{getFieldDecorator('newOperator', {initialValue: `${operatorInfo.fio}`})(
								<Select className={'operator-info__select'}
								        dropdownMatchSelectWidth={false}
								        onSelect={() => this.setState({disabled: false})}>
									{options}
								</Select>
							)}
						</Form.Item>
						<div className={'operator-change__control-buttons'}>
							<Form.Item className={'operator-info__button'}>
								{this.getChangeButton()}
							</Form.Item>
							<Form.Item className={'operator-info__button'}>
								<Button className={'operator-info__change-button'}
								        onClick={() => {
									        this.setState({disabled: true});
									        cancelOperatorChange()
								        }}>
									{'Отмена'}
								</Button>
							</Form.Item>
						</div>
					</Form>

				)
			}
			if (clients.rooms[selectedRoom].operator) {
				return (
					<Button className={'moreInfo__take-button'} onClick={() => {
						chooseNewOperator(true);
						socket.sendWithoutBody('getOperators')
					}}>
						{'Сменить оператора'}
					</Button>
				)
			}
		}
		return <div/>
	}

	getChangeButton() {
		if (this.state.disabled) {
			return (
				<Button className={'operator-info__change-button'} disabled>
					{'Сменить'}
				</Button>
			)
		} else {
			return (
				<Button onClick={() => this.onChangeOperator()}
				        className={'operator-info__change-button'}
				        htmlType={'submit'}>
					{'Сменить'}
				</Button>
			)
		}
	}

	onChangeOperator() {
		const {
			chooseNewOperator
		} = this.props;
		this.sendToNewOperator();
		chooseNewOperator(false);
	}

	sendToNewOperator() {
		const {
			chooseNewOperator,
			form: {
				getFieldValue
			},
			socket,
			clients,
			selectedRoom
		} = this.props;
		chooseNewOperator(false);
		let newOper = getFieldValue('newOperator');
		if (clients.rooms && clients.rooms[selectedRoom]) {
			socket.sendWithBody('changeOperator', {
				to: +newOper,
				rid: +selectedRoom
			});
			socket.sendWithBody('getRoomsByStatus', {type: 'roomRecieved'});
		}
	}

	getTitle(status) {
		switch (status) {
			case 'roomNew':
				return 'Новая';
			case 'roomRecieved':
				return 'В обработке';
			case 'roomSend':
				return 'В ожидании';
		}
	}

	save() {
		const {
			form: {
				getFieldValue
			},
			updateNote,
			socket,
			selectedRoom
		} = this.props;
		let note = getFieldValue('note');
		updateNote();
		socket.sendWithBody('sendNote', {
			rid: +selectedRoom,
			note
		})
	}

	changeToChat() {
		const {
			enterRoom,
			socket,
			selectedRoom,
			changeMessagesByStatus
		} = this.props;
		enterRoom(selectedRoom);
		socket.sendWithBody('enterRoom', {rid: +selectedRoom});
	}

	render() {
		const {
			clients,
			selectedRoom,
			form: {
				getFieldDecorator
			},
			status,
			changeMessagesByStatus
		} = this.props;
		let takeButton;
		if (status === 'roomNew') {
			takeButton = (
				<Link to={`/active-messages/${selectedRoom}`}>
					<Button className={'moreInfo__take-button'}
					        onClick={() => {
						        changeMessagesByStatus('roomRecieved', true);
						        this.changeToChat();
					        }}>{'Принять заявку'}</Button>
				</Link>
			)
		}
		if (selectedRoom && clients && clients.rooms && clients.rooms[selectedRoom]) {
			return (
				<div className={'more-info'}>
					<div className={'more-info__title'}>{'Подробная информация'}</div>
					<div className={'moreInfo__content'}>
						<div className={'moreInfo__block'}>
							<div className={'moreInfo__block-title'}>{`Автор`}</div>
							<div
								className={'moreInfo__block-content'}>{`${clients.rooms[selectedRoom].client.nick || 'Аноним'}`}</div>
						</div>
						<div className={'moreInfo__block'}>
							<div className={'moreInfo__block-title'}>{`Время`}</div>
							<div
								className={'moreInfo__block-content'}>{`${moment(clients.rooms[selectedRoom].time, 'X').format('HH:mm')}`}</div>
							<div
								className={'moreInfo__block-content'}>{`${moment(clients.rooms[selectedRoom].time, 'X').format('DD.MM.YYYY')}`}</div>
						</div>
						<div className={'moreInfo__block'}>
							<div className={'moreInfo__block-title'}>{`Статус`}</div>
							<div
								className={'moreInfo__block-content'}>{`${this.getTitle(clients.rooms[selectedRoom].status)}`}</div>
						</div>
						<div className={'moreInfo__block'}>
							<div className={'moreInfo__block-title'}>{`Описание проблемы`}</div>
							<Twemoji>
								<div
									className={'moreInfo__block-content-description'}>{`${clients.rooms[selectedRoom].description || clients.rooms[selectedRoom].lastMessage}`}</div>
							</Twemoji>
						</div>
					</div>
					<Form className={'note-info'}>
						<Form.Item className={'note-form-item'}>
							{getFieldDecorator('note', {initialValue: ``})(
								<Input.TextArea rows={3} placeholder={'Заметка...'} className={'note-input'}/>
							)}
						</Form.Item>
						<Form.Item className={'note-form-item-submit'}>
							<Button type={'submit'} className={'note-form-input__button'} onClick={() => this.save()}>
								{'Сохранить'}
							</Button>
						</Form.Item>
					</Form>
					{this.changeOperator()}
					{takeButton}
				</div>
			)
		}
		return <div/>
	}
}

const InitMoreInfo = Form.create()(moreInfoInit);

const mapStateToProps = state => ({
	clients: state.clients,
	status: state.activeStatus,
	selectedRoom: state.selectedRoom,
	chooseOperator: state.chooseOperator,
	operators: state.operators,
	activeStatus: state.activeStatus,
	operatorInfo: state.operatorInfo,
});

const mapDispatchToProps = dispatch => ({
	chooseNewOperator: (choose) => dispatch(chooseNewOperator(choose)),
	cancelOperatorChange: () => dispatch(cancelOperatorChange()),
	changeMessagesByStatus: (status) => dispatch(changeMessagesByStatus(status)),
	updateNote: () => dispatch(updateNote()),
	enterRoom: (room) => dispatch(enterRoom(room))
});

const MoreInfo = connect(
	mapStateToProps,
	mapDispatchToProps
)(InitMoreInfo);

export default MoreInfo;

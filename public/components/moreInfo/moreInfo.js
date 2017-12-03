'use strict';

import React from 'react';
import {connect} from 'react-redux'
import './moreinfo.less'
import {
	Row,
	Button,
	Select,
	Form,
	Input
} from 'antd';
import {cancelOperatorChange, chooseNewOperator, getExtraInfo, updateNote} from '../../view/action';
import moment from 'moment';


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
					<Form className={'right-sider-content operator-info'}>
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
								<Button onClick={() => {
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
					<Row className={'moreInfo__operator right-sider-content'}>
						<div>{`Оператор:  ${operatorInfo.fio}`}</div>
						<Button className={'moreInfo__operator-button'} onClick={() => {
							chooseNewOperator(true);
							socket.sendWithoutBody('getOperators')
						}}>
							<div style={{whiteSpace: 'pre-line', maxHeight: '3em'}}>
								{'Сменить оператора'}
							</div>
						</Button>
					</Row>
				)
			}
		}
		return <div/>
	}

	getChangeButton() {
		if (this.state.disabled) {
			return (
				<Button disabled>
					{'Сменить'}
				</Button>
			)
		} else {
			return (
				<Button onClick={() => this.onChangeOperator()}
				        htmlType={'submit'}>
					{'Сменить'}
				</Button>
			)
		}
	}

	onChangeOperator() {
		const {
			getExtraInfo,
			chooseNewOperator
		} = this.props;
		this.sendToNewOperator();
		getExtraInfo(false);
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
			})
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

	getInfo() {
		const {
			clients,
			selectedRoom,
			form: {
				getFieldDecorator
			}
		} = this.props;
		if (selectedRoom && clients && clients.rooms && clients.rooms[selectedRoom]) {
			return (
				<div>
					<div style={{
						fontSize: '24px',
						color: 'white',
						marginBottom: '12px'
					}}>{'Подробная информация о проблеме'}</div>
					{this.changeOperator()}
					<div className={'moreInfo__content right-sider-content'}>
						<div>{`Автор: ${clients.rooms[selectedRoom].client.nick || 'Аноним'}`}</div>
						<div>{`Время обращения:  ${moment(clients.rooms[selectedRoom].time, 'X').format('HH:mm DD.MM.YYYY')}`}</div>
						<div>{`Статус:  ${this.getTitle(clients.rooms[selectedRoom].status)}`}</div>
						<div>{`Подробное описание проблемы:  ${clients.rooms[selectedRoom].description || clients.rooms[selectedRoom].lastMessage}`}</div>
					</div>
					<Form className={'right-sider-content note-info'}>
						<Form.Item className={'note-form-item'}>
							{getFieldDecorator('note', {initialValue: ``})(
								<Input.TextArea rows={4} placeholder={'Заметка...'} className={'note-input'}/>
							)}
						</Form.Item>
						<Form.Item className={'note-form-item'}>
							<Button type={'submit'} onClick={() => this.save()}>
								{'Сохранить'}
							</Button>
						</Form.Item>
					</Form>
				</div>
			)
		}
		return <div/>
	}

	render() {
		const {
			getInfo
		} = this.props;
		return this.getInfo();
	}
}

const InitMoreInfo = Form.create()(moreInfoInit);

const mapStateToProps = state => ({
	clients: state.clients,
	selectedRoom: state.selectedRoom,
	chooseOperator: state.chooseOperator,
	operators: state.operators,
	activeStatus: state.activeStatus,
	operatorInfo: state.operatorInfo,
});

const mapDispatchToProps = dispatch => ({
	chooseNewOperator: (choose) => dispatch(chooseNewOperator(choose)),
	getExtraInfo: (status) => dispatch(getExtraInfo(status)),
	cancelOperatorChange: () => dispatch(cancelOperatorChange()),
	updateNote: () => dispatch(updateNote())
});

const MoreInfo = connect(
	mapStateToProps,
	mapDispatchToProps
)(InitMoreInfo);

export default MoreInfo;

'use strict';

import React from 'react';
import {connect} from 'react-redux'
import './moreinfo.less'
import {
	Row,
	Button,
	Select,
	Form
} from 'antd';
import {chooseNewOperator} from "../../view/action";


class moreInfoInit extends React.Component {

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
			}
		} = this.props;
		if (clients.rooms && clients.rooms[selectedRoom]) {
			if (chooseOperator && operators) {
				let options = [];
				options = operators.map(item => <Select.Option value={`${item.id}`}
				                                               key={`operator_${item.id}`}>{item.fio}</Select.Option>)
				return (
					<Form className={'right-sider-content operator-info'}>
						<Form.Item className={'operator-info__select'}>
							{getFieldDecorator('newOperator', {initialValue: `${clients.rooms[selectedRoom].operator.id}`})(
								<Select className={'operator-info__select'}
								        dropdownMatchSelectWidth={false}>
									{options}
								</Select>
							)}
						</Form.Item>
						<Form.Item className={'operator-info__button'}>
							<Button onClick={() => this.sendToNewOperator()}
							        htmlType={'submit'}>
									{'Сменить'}
							</Button>
						</Form.Item>
					</Form>

				)
			}
			return (
				<Row className={'moreInfo__operator right-sider-content'}>
					<div>{`Оператор:  ${clients.rooms[selectedRoom].operator.fio}`}</div>
					<Button className={'moreInfo__operator-button'} onClick={() => {
						chooseNewOperator(true);
						socket.sendWithoutBody('getOperators')
					}}>{'Сменить оператора'}</Button>
				</Row>
			)
		}
		return <div/>
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
		if(clients.rooms && clients.rooms[selectedRoom]) {
			socket.sendWithBody('changeOperator', {
				to: +newOper,
				rid: +selectedRoom
			})
		}
	}


	getInfo() {
		const {
			clients,
			selectedRoom,
			getInfo,
		} = this.props;
		if (selectedRoom && getInfo && clients && clients.rooms && clients.rooms[selectedRoom]) {
			return (
				<div>
					<Row style={{fontSize: '24px', color: 'white'}}>{'Подробная информация о проблеме'}</Row>
					{this.changeOperator()}
					<div className={'moreInfo__content right-sider-content'}>
						<div>{`Автор: ${clients.rooms[selectedRoom].client.nick}`}</div>
						<div>{`Проблема: ${clients.rooms[selectedRoom].title}`}</div>
						<div>{`Время обращения:  ${clients.rooms[selectedRoom].time}`}</div>
						<div>{`Статус:  ${clients.rooms[selectedRoom].status}`}</div>
						<div>{`Подробное описание проблемы:  ${clients.rooms[selectedRoom].description}`}</div>
					</div>
				</div>
			)
		}
		return <div/>
	}

	render() {
		const {
			getInfo
		} = this.props;
		if (getInfo) {
			return this.getInfo();
		}
		return <div/>
	}
}

const InitMoreInfo = Form.create()(moreInfoInit);

const mapStateToProps = state => ({
	clients: state.clients,
	selectedRoom: state.selectedRoom,
	getInfo: state.getInfo,
	chooseOperator: state.chooseOperator,
	operators: state.operators
});

const mapDispatchToProps = dispatch => ({
	chooseNewOperator: (choose) => dispatch(chooseNewOperator(choose))
});

const MoreInfo = connect(
	mapStateToProps,
	mapDispatchToProps
)(InitMoreInfo);

export default MoreInfo;

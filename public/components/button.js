'use strict';

import React from 'react'
import {
	Button,
	Card,
	Input,
	Form
} from 'antd'
import Socket from '../models/socket'
import {connect} from 'react-redux'
import './button.less';
import {changedData, receiveData, requestData} from './action';

class ChatButton extends React.Component {

	constructor() {
		super();
		this.state = {};
	}

	onClick(event, label) {
		let {
			dataReceive
		} = this.props;
		if (!this.hasOwnProperty('socket')) {
			this.socket = new Socket(dataReceive);
		}
		this.setState({card: true});
	}

	getCard(messages) {
		const {getFieldDecorator} = this.props.form;
		let allMessages;
		if (messages) {
			allMessages = messages.map((item, position) => <div className={`chat-card__${item.place}-message`}>
				<p className={`${item.place}-message`} key={position}>{item.message}</p>
			</div>);
		}
		return (<Card title={'Чат'} bordered style={{width: '25vw'}}>
			{allMessages}
			<Form className={`chat-form`}>
				<Form.Item/>
				{getFieldDecorator('message', {})(<Input.TextArea autosize={{minRows: 3, maxRows: 4}}
				                                                   className={'chat-input__textarea'}
				                                                   placeholder={'Введите свое сообщение'}/>)}
				<Form.Item/>
				<Button onClick={() => this.onPressEnter()} className={'chat-input__button'}>{'Отправить'}</Button>
			</Form>
		</Card>);
	}

	onPressEnter(event, label) {
		let message = this.props.form.getFieldValue('message');
		this.props.form.resetFields();
		this.props.dataChanged(message);
		this.socket.send({Hi: {Id: message}});
	}

	render() {
		if (this.state.hasOwnProperty('card')) {
			return this.getCard(this.props.messages);
		}
		return (<Button
			onClick={this.onClick.bind(this)}
			size='large'
			className={'start-button'}
		>{'Начать чат'}</Button>)
	}
}

const FormButton = Form.create()(ChatButton)

const mapStateToProps = (state) => {
	return {
		messages: state.messages
	}
};

const mapDispatchToProps = dispatch => {
	return {
		dataChanged: (message) => dispatch(changedData(message)),
		dataReceive: (message) => dispatch(receiveData(message)),
		dataRequest: () => dispatch(requestData())
	}
};

const FullButton = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormButton);

export default FullButton

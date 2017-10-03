'use strict';

import React from 'react'
import {
	Card,
	Form,
	Input,
	Button
} from 'antd'
import {connect} from 'react-redux'
import './createChatForm.less'
import './button.less'

class CreateChatForm extends React.Component {

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (<Card title={'Чат'} bordered style={{width: '25vw'}}>
			<Form className={'createForm'}>
				<Form.Item label={'Введите проблему'} labelCol={{span:2}} wrapperCol={{span: 10}}>
					{getFieldDecorator('message', {})(<Input className={'chat-input__textarea'}
					                                         placeholder={'Введите свое сообщение'}/>)}
				</Form.Item>
				<Form.Item label={'Опишите вашу проблему'} labelCol={{span:2}} wrapperCol={{span: 10}}>
				{getFieldDecorator('message', {})(<Input.TextArea autosize={{minRows: 3, maxRows: 4}}
				                                                  className={'chat-input__textarea'}
				                                                  placeholder={'Введите свое сообщение'}/>)}
				</Form.Item>
				<Form.Item>
					<Button onClick={() => this.onPressEnter()} className={'chat-input__button'}>{'Отправить'}</Button>
				</Form.Item>
			</Form>
		</Card>)
	}
}

const startChatForm = Form.create()(CreateChatForm);

const mapDispatchToProps = dispatch => {
	return {}
};

const StartChatForm = connect(
	() => {},
	mapDispatchToProps)(startChatForm)

export default StartChatForm

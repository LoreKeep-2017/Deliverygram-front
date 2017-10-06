'use strict';

import React from 'react'
import {
	Card,
	Form,
	Input,
	Button,
	Row
} from 'antd'
import {connect} from 'react-redux'
import './createChatForm.less'
import './button.less'
import {switchToChatFrom} from './action';

class CreateChatForm extends React.Component {

	onClick() {
		const {
			switchToChatFrom,
			form: {
				getFieldValue
			}
		} = this.props;
		const title = getFieldValue('title');
		const description = getFieldValue('description');
		switchToChatFrom(title, description);
	}

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<Row>
				<div>
					<Button icon={'close'}/>
				</div>
				<Card title={'Чат'} bordered style={{width: '25vw'}}>
					<Form className={'createForm'}>
						<Form.Item label={'Введите проблему'} labelCol={{span: 6}} wrapperCol={{span: 18}}>
							{getFieldDecorator('title', {})(<Input className={'chat-input__textarea'}
							                                       placeholder={'Введите свое сообщение'}/>)}
						</Form.Item>
						<Form.Item label={'Опишите вашу проблему'} labelCol={{span: 6}} wrapperCol={{span: 18}}>
							{getFieldDecorator('description', {})(<Input.TextArea autosize={{minRows: 3, maxRows: 4}}
							                                                      className={'chat-input__textarea'}
							                                                      placeholder={'Введите свое сообщение'}/>)}
						</Form.Item>
						<Form.Item>
							<Button onClick={() => this.onClick()}
							        className={'chat-input__button'}>{'Отправить'}</Button>
						</Form.Item>
					</Form>
				</Card>
			</Row>)
	}
}

const startChatForm = Form.create()(CreateChatForm);

const mapDispatchToProps = dispatch => ({
	switchToChatFrom: (issue, description) => dispatch(switchToChatFrom(issue, description))
})

const StartChatForm = connect(
	() => ({}), mapDispatchToProps)(startChatForm)

export default StartChatForm

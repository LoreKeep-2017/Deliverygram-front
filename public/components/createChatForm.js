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
import {closeStartForm, restorePrevChat, switchToChatFrom} from './action';

class CreateChatForm extends React.Component {

	goToChatForm() {
		const {
			switchToChatFrom,
			form: {
				getFieldValue
			}
		} = this.props;
		const title = getFieldValue('title');
		const description = getFieldValue('description');
		const nick = getFieldValue('nick')
		switchToChatFrom(title, description, nick);
	}

	getPrevChat() {
		const {
			restorePrevChat
		} = this.props;
		restorePrevChat();
	}

	close() {
		const {
			closeStartForm
		} = this.props;
		closeStartForm('startForm');
	}

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<Row style={{width: '25vw'}}>
				<div style={{float: 'right'}}>
					<Button icon={'minus'} className={'closeButton'} onClick={() => this.close()}/>
				</div>
				<Card title={'Чат'} bordered>
					<Form className={'createForm'}>
						<Form.Item label={'Как к вам можно обращаться'} labelCol={{span: 6}} wrapperCol={{span: 18}}>
							{getFieldDecorator('nick', {})(<Input className={'chat-input__textarea'}
							                                      placeholder={'Введите свое сообщение'}/>)}
						</Form.Item>
						<Form.Item label={'Введите проблему'} labelCol={{span: 6}} wrapperCol={{span: 18}}>
							{getFieldDecorator('title', {})(<Input className={'chat-input__textarea'}
							                                       placeholder={'Введите свое сообщение'}/>)}
						</Form.Item>
						<Form.Item label={'Опишите вашу проблему'} labelCol={{span: 6}} wrapperCol={{span: 18}}>
							{getFieldDecorator('description', {})(<Input.TextArea autosize={{minRows: 3, maxRows: 4}}
							                                                      className={'chat-input__textarea'}
							                                                      placeholder={'Введите свое сообщение'}/>)}
						</Form.Item>
						<Row>
							<span>{'или востановить'}</span>
							<Button className={''}
							        onClick={() => {
							        	this.getPrevChat();
							        }}>{'предыдущую'}</Button>
							<span>{'переписку'}</span>
						</Row>
						<Form.Item>
							<Button onClick={() => this.goToChatForm()}
							        className={'chat-input__button'}>{'Отправить'}</Button>
						</Form.Item>
					</Form>
				</Card>
			</Row>)
	}
}

const startChatForm = Form.create()(CreateChatForm);

const mapDispatchToProps = dispatch => ({
	switchToChatFrom: (issue, description, nick) => dispatch(switchToChatFrom(issue, description, nick)),
	closeStartForm: (lastPosition) => dispatch(closeStartForm(lastPosition)),
	restorePrevChat: () => dispatch(restorePrevChat()),
})

const StartChatForm = connect(
	() => ({}), mapDispatchToProps)(startChatForm)

export default StartChatForm

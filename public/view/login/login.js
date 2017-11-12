'use strict';

import React from 'react'
import {
	Col,
	Form,
	Input,
	Button,
	Spin
} from 'antd'
import {connect} from "react-redux";
import './login.less';
import {
	loginFailed,
	loginPending,
	loginSuccess, saveUrl
} from '../action';
import {axiosPost} from '../../models/axios';

class LoginInit extends React.Component {

	componentDidMount() {
		const {
			prevState,
			saveUrl
		} = this.props;
		if (prevState && prevState.url) {
			saveUrl(prevState.url);
		}
	}

	onSubmit(event) {
		event.preventDefault();
		const {
			form: {
				getFieldValue,
				resetFields
			},
			loginPending,
			loginSuccess,
			loginFailed
		} = this.props;
		let login = getFieldValue('login');
		let password = getFieldValue('password');
		loginPending();
		axiosPost({
			path: '/login/',
			body: JSON.stringify({login, password}),
		}).then(response => {
			console.log(response)
			loginSuccess(response);
		}).catch(response => {
			loginFailed();
		});
		resetFields(['password']);

	}

	getFormContent() {
		const {
			form: {
				getFieldDecorator
			}
		} = this.props;
		return (
			<Form className={'form'} onSubmit={(event) => this.onSubmit(event)}>
				<Form.Item className={'form-item'}>
					{getFieldDecorator('login', {initialValue: ''})(
						<Input className={'form-item__input-login'}
						       placeholder={'Логин'}
						/>
					)}
				</Form.Item>
				<Form.Item className={'form-item'}>
					{getFieldDecorator('password', {initialValue: ''})(
						<Input className={'form-item__input-password'}
						       type={'password'}
						       placeholder={'Пароль'}
						/>
					)}
				</Form.Item>
				<Button htmlType={'submit'}>{'Авторизоваться'}</Button>
			</Form>
		)
	}

	render() {
		const {
			pending
		} = this.props;
		let content = pending ? <Spin size={'large'}/> : this.getFormContent();
		return (
			<div className={'body-div'}>
				<Col className={'content'}>
					{content}
				</Col>
			</div>)
	}
}

const LoginForm = Form.create()(LoginInit);

const mapStateToProps = state => ({
	pending: state.loginStatuses.pending
})

const mapDispatchToProps = dispatch => ({
	loginPending: () => dispatch(loginPending()),
	loginSuccess: (data) => dispatch(loginSuccess(data)),
	loginFailed: () => dispatch(loginFailed()),
	saveUrl: (url) => dispatch(saveUrl(url))
})

const Login = connect(mapStateToProps, mapDispatchToProps)(LoginForm)

export default Login

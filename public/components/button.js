'use strict';

import React from 'react'
import {
	Button,
	Card,
	Input,
	Form
} from 'antd'
import {connect} from 'react-redux'
import './button.less';
import {switchToStartForm} from './action';
import StartChatForm from './createChatForm'
import ChatForm from './chatForm'

class ChatButton extends React.Component {

	onClick() {
		this.props.switchToStartForm();
	}

	onPressEnter(event, label) {
		let message = this.props.form.getFieldValue('message');
		this.props.form.resetFields();
		this.props.dataChanged(message);
		this.socket.send({Hi: {Id: message}});
	}

	render() {
		const {
			position
		} = this.props;
		if (position) {
			switch (position) {
				case 'startForm':
					return <StartChatForm/>
				case 'chatForm':
					return <ChatForm/>
				default :
					return <h1>{'Sorry, there is some problem'}</h1>
			}
		}
		return (
			<Button
				onClick={() => this.onClick()}
				size='large'
				className={'start-button'}>
				{'Начать чат'}
			</Button>)
	}
}

const FormButton = Form.create()(ChatButton)

const mapStateToProps = (state) => {
	return {
		position: state.position
	}
};

const mapDispatchToProps = dispatch => {
	return {
		switchToStartForm: () => dispatch(switchToStartForm())
	}
};

const FullButton = connect(
	mapStateToProps,
	mapDispatchToProps
)(FormButton);

export default FullButton

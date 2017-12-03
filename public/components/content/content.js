'use strict';

import React from 'react';
import {connect} from 'react-redux';
import {
	Form
} from 'antd';
import Messages from '../messages/messages';
import MainForm from '../chatForm/chatForm';

class CreateInitContent extends React.Component {

	render() {
		const {
			status,
			socket,
		} = this.props;

		return (
			<section className={'content'}>
				<Messages/>
				<MainForm socket={socket}/>
			</section>
		)
	}
}

const InitContent = Form.create()(CreateInitContent);

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

const ChatContent = connect(
	mapStateToProps,
	mapDispatchToProps
)(InitContent);

export default ChatContent;

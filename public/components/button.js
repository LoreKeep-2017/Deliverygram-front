'use strict';

import React from 'react'
import {
	Button,
	Card,
	Input
} from 'antd'
import {changedData} from '../components/action';
import {connect} from 'react-redux'
import dataWorking from '../reducers/view'
import Socket from '../models/socket'
import {receiveData, requestData} from "./action";

class ChatButton extends React.Component {

	constructor() {
		super();
		this.state = {};
	}

	componentDidMount(){

	}

	onClick(event, label) {
		this.props.dataChanged();
		if( !this.hasOwnProperty('socket')) {
			this.socket = new Socket();
		}
		this.setState({
			card: (<Card title={'Чат'} bordered={'true'}>
				<Input.TextArea autosize={{minRows: 2, maxRows: 4}} style={{width: 300, padding: 10}}
				                placeholder={'Введите свое сообщение'} onPressEnter={this.onPressEnter.bind(this)}/>
			</Card>)
		});
	}

	onPressEnter(event, label) {
		this.props.dataRequest();
		this.socket.send({message: event.target.value});
		console.log(event, label);
		console.log(event.target.value);
	}

	render() {
		if (this.state.hasOwnProperty('card')) {
			return this.state.card;
		}
		return (<Button
			onClick={this.onClick.bind(this)}
			size='large'
			style={{
				width: 200,
				height: 50,
				'font-size': 20,
				display: 'flex',
				'align-items': 'center',
				'justify-content': 'center'
			}}
		>{'Начать чат'}</Button>)
	}
}

const mapStateToProps = (state, action) => {
	return {
		newState: dataWorking(state, action)
	}
};

const mapDispatchToProps = dispatch => {
	return {
		dataChanged: id => {
			dispatch(changedData())
		},
		dataRecieve: () => dispatch(receiveData()),
		dataRequest: () => dipatch(requestData())
	}
};

const FullButton = connect(
	mapStateToProps,
	mapDispatchToProps
)(ChatButton);

export default FullButton

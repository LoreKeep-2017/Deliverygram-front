'use strict';

import React from 'react'
import {
	Layout,
	Menu,
	Card,
	Form,
	Input,
	Button
} from 'antd';
import {connect} from 'react-redux';
import Socket from '../models/socket';
import {changedData} from '../components/action';
import {recieveClients} from './action';
import './main.less';

const {
	Header,
	Content,
	Footer,
	Sider
} = Layout;

class MainView extends React.Component {

	constructor() {
		super();
		this.state = {
			collapsed: false,
		};
		this.toggle = () => {
			this.setState({
				collapsed: !this.state.collapsed,
			});
		}
	}

	componentDidMount() {
		const {
			dataRecieved
		} = this.props;
		this.socket = new Socket(dataRecieved);
	}

	onClick(event) {
		const {
			dataChanged,
			form: {
				getFieldValue,
				resetFields
			}
		} = this.props;
		let message = getFieldValue('message');
		dataChanged(message);
		resetFields();
		this.socket.send({Hi: {Id: message}});
	}

	getMessages() {
		const {
			state
		} = this.props;
		let allMessages = [];
		if (state) {
			state.forEach(item => {
				allMessages.push(<div>{item.message}</div>)
			});
		}
		return allMessages;
	}

	getClientsRequests() {
		let {clients} = this.props;
		return clients.map(item => <Menu.Item style={{
			paddingLeft: 0,
			padding: 0,
			margin: '20px',
			background: 'white',
			height: 'auto',
			width: '80%',
		}}>
			<Card title={'Возврат средств'} style={{width: '100%', height: '100%'}}>
				<div>
					<p style={{color: 'black', paddingLeft: '1em'}}>
						{}
					</p>
					<p style={{color: 'black', paddingLeft: '1em'}}>
						{}
					</p>
				</div>
			</Card>
		</Menu.Item>)
	}

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		return (
			<Layout>
				<Sider width={300} style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}>
					<div className={'logo'}/>
					<Menu theme={'dark'} mode={'inline'} defaultSelectedKeys={['4']}>
						{this.getClientsRequests()}
					</Menu>
				</Sider>
				<Layout style={{marginLeft: 300}}>
					<Header style={{background: '#fff', padding: 0, height: '10vh'}}>

					</Header>
					<Content className={'content'}>
						<Card bordered className={'operator-messages'}>
							<div>
								{this.getMessages()}
							</div>
						</Card>
						<Form className={'operator-chat'}>
							<Form.Item style={{width: '100%'}}>
								{getFieldDecorator('message', {})(
									<Input.TextArea autosize={{minRows: 3, maxRows: 5}}
									                placeholder={'Введите свое сообщение'}
									                className={'operator-chat__input-form'}
									                onPressEnter={(event) => console.log(event)}/>
								)}
								<Button onClick={() => this.onClick()}>{'Отправить'}</Button>
							</Form.Item>
						</Form>
					</Content>
				</Layout>
			</Layout>
		);
	}
}

const mapStateToProps = state => {
	return {
		state: state.messages,
		clients: state.clients
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dispatchFunc: {
			dataChanged: (message) => dispatch(changedData(message)),
			dataReceive: (message) => dispatch(receiveData(message)),
			dataRequest: () => dispatch(requestData()),
			recieveClients: (clients) => dispatch(recieveClients(clients))
		}
	}
}

const FullMainView = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(MainView));

export default FullMainView;

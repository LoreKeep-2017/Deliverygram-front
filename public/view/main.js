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
		this.props.dataChanged(this.props.form.getFieldsValue().message);
		this.props.form.resetFields();
	}

	getMessages() {
		const {
			state
		} = this.props;
		console.log(this.props.state);
		let allMessages = [];
		if (state) {
			state.forEach(item => {
				allMessages.push(<div>{item.message}</div>)
			});
		}
		console.log(allMessages);
		return allMessages;
	}

	settingMenuItem() {
		let answer = (
			<Menu.Item style={{
				margin: 20,
				backgroundColor: 'white',
				height: 'auto',
				width: '80%',
				padding: '0px 0px 0px 0px'
			}}>
				<Card title={'Возврат средств'} style={{width: '100%', height: '100%'}}>
					<div>
						<p style={{color: 'black', paddingLeft: '1em'}}>
							{'Добрый день. Хотел бы вернуть деньги за свою...'}
						</p>
						<p style={{color: 'black', paddingLeft: '1em'}}>
							{'Запрос поступил: 2 ч. назад'}
						</p>
					</div>
				</Card>
			</Menu.Item>)
		let allMessages = [];
		allMessages.push(answer);
		allMessages.push(answer);
		allMessages.push(answer);
		allMessages.push(answer);
		allMessages.push(answer);
		return allMessages;
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
						{this.settingMenuItem()}
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
								                onPressEnter={(event) => console.log(event.target.value)}/>
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
		state: state.messages
	}
}

const mapDispatchToProps = dispatch => {
	return {
		dataChanged: (message) => dispatch(changedData(message)),
		dataReceive: (message) => dispatch(receiveData(message)),
		dataRequest: () => dispatch(requestData())
	}
}

const FullMainView = connect(
	mapStateToProps,
	mapDispatchToProps
)(Form.create()(MainView));

export default FullMainView;

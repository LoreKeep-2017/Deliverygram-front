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
								<div style={{backgroundColor: 'black', margin: '1em', height: '2em'}}/>
								<div style={{backgroundColor: 'black', margin: '1em', height: '2em'}}/>
								<div style={{backgroundColor: 'black', margin: '1em', height: '2em'}}/>
							</div>
						</Card>
						<Form className={'operator-chat'}>
							<Form.Item style={{width: '100%'}}>
								<Input.TextArea autosize={{minRows: 3, maxRows: 5}}
								                placeholder={'Введите свое сообщение'}
								                className={'operator-chat__input-form'}
								                onPressEnter={(event) => console.log(event.target.value)}/>
								<Button>{'Отправить'}</Button>
							</Form.Item>
						</Form>
					</Content>
				</Layout>
			</Layout>
		);
	}
}

const FullMainView = Form.create()(MainView);

export default FullMainView;

'use strict';

import React from 'react'
import { Layout, Icon, Menu } from 'antd';
import './main.css'
const { Header, Content, Footer, Sider } = Layout;

export default class SiderDemo extends React.Component {

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
		<Menu.Item>
			<Icon type={'message'} style={{width: 100, height: 100}} />
			<span className="nav-text">nav 1</span>
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
				<Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }}>
					<div className={'logo'} />
					<Menu className={'menu'} theme={'dark'} mode={'inline'} defaultSelectedKeys={['4']}>
						{this.settingMenuItem()}
					</Menu>
				</Sider>
				<Layout style={{ marginLeft: 200 }}>
					<Header style={{ background: '#fff', padding: 0 }} />
					<Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
						<div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
							...
							<br />
							Really
							<br />...<br />...<br />...<br />
							long
							<br />...<br />...<br />...<br />...<br />...<br />...
							<br />...<br />...<br />...<br />...<br />...<br />...
							<br />...<br />...<br />...<br />...<br />...<br />...
							<br />...<br />...<br />...<br />...<br />...<br />...
							<br />...<br />...<br />...<br />...<br />...<br />...
							<br />...<br />...<br />...<br />...<br />...<br />...
							<br />...<br />...<br />...<br />...<br />...<br />
							content
						</div>
					</Content>
					<Footer style={{ textAlign: 'center' }}>
						Ant Design ©2016 Created by Ant UED
					</Footer>
				</Layout>
			</Layout>
		);
	}
}

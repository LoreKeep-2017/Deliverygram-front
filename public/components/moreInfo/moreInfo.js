'use strict';

import React from 'react';
import {connect} from 'react-redux'
import './moreinfo.less'


class moreInfoInit extends React.Component {

	render() {
		const {
			clients,
			selectedRoom,
			getInfo
		} = this.props;
		if (selectedRoom && getInfo && clients) {
			return (
				<div className={'moreInfo__content right-sider-content'}>
					<div>{`Автор: ${clients.rooms[selectedRoom].client.nick}`}</div>
					<div>{`Проблема: ${clients.rooms[selectedRoom].title}`}</div>
					<div>{`Время обращения:  ${clients.rooms[selectedRoom].time}`}</div>
					<div>{`Статус:  ${clients.rooms[selectedRoom].status}`}</div>
					<div>{`Подробное описание проблемы:  ${clients.rooms[selectedRoom].description}`}</div>
				</div>)
		}
		return <div/>;
	}
}

const mapStateToProps = state => ({
	clients: state.clients,
	selectedRoom: state.selectedRoom,
	getInfo: state.getInfo
})

const mapDispatchToProps = dispatch => ({})

const MoreInfo = connect(
	mapStateToProps,
	mapDispatchToProps
)(moreInfoInit);

export default MoreInfo;



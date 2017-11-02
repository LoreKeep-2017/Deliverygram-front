'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {Route, Switch, withRouter} from 'react-router-dom'
import ChatLayout from '../layout/layout'
import {
	changeMessagesByStatus,
	getExtraInfo,
	selectRoom
} from '../action';

class MainView extends React.Component {

	render() {
		const {
			changeMessagesByStatus,
			selectRoom,
			getExtraInfo
		} = this.props;
		return (
			<Switch>
				<Route exact path={'/'} render={(props) => {
					return <ChatLayout/>
				}}/>
				<Route exact path={'/new-messages'} render={(props) => {
					changeMessagesByStatus('roomNew');
					return <ChatLayout path={'new-messages'}/>
				}}/>
				<Route exact path={'/new-messages/:id'} render={(props) => {
					changeMessagesByStatus('roomNew');
					selectRoom(props.match.params.id);
					return <ChatLayout path={'new-messages'} match={props.match}/>
				}}/>
				<Route exact path={'/new-messages/:id/info'} render={(props) => {
					changeMessagesByStatus('roomNew');
					selectRoom(props.match.params.id);
					getExtraInfo(true);
					return <ChatLayout path={'new-messages'} match={props.match}/>
				}}/>
				<Route exact path={'/active-messages'} render={(props) => {
					changeMessagesByStatus('roomBusy');
					return <ChatLayout path={'active-messages'} match={props.match}/>
				}}/>
				<Route exact path={'/active-messages/:id'} render={(props) => {
					changeMessagesByStatus('roomBusy');
					selectRoom(props.match.params.id);
					return <ChatLayout path={'active-messages'} match={props.match}/>
				}}/>
				<Route exact path={'/active-messages/:id/info'} render={(props) => {
					changeMessagesByStatus('roomBusy');
					selectRoom(props.match.params.id);
					getExtraInfo(true);
					return <ChatLayout path={'active-messages'} match={props.match}/>
				}}/>
				<Route exact path={'/closed-messages'} render={(props) => {
					changeMessagesByStatus('roomClose');
					return <ChatLayout path={'closed-messages'}/>
				}}/>
				<Route exact path={'/closed-messages/:id'} render={(props) => {
					changeMessagesByStatus('roomClose');
					selectRoom(props.match.params.id);
					return <ChatLayout path={'closed-messages'} match={props.match}/>
				}}/>
				<Route exact path={'/closed-messages/:id/info'} render={(props) => {
					changeMessagesByStatus('roomClose');
					selectRoom(props.match.params.id);
					getExtraInfo(true);
					return <ChatLayout path={'closed-messages'} match={props.match}/>
				}}/>
			</Switch>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	changeMessagesByStatus: (status) => dispatch(changeMessagesByStatus(status)),
	getExtraInfo: (getInfo) => dispatch(getExtraInfo(getInfo)),
	selectRoom: (rid) => dispatch(selectRoom(rid))
});

export default withRouter(connect(
	(state) => ({}), mapDispatchToProps
)(MainView));

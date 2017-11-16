'use strict';

import React from 'react'
import {connect} from 'react-redux';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom'
import ChatLayout from '../layout/layout'
import Login from "../login/login";
import {axiosGet} from "../../models/axios";
import {
	checkAuthFailed,
	loginFailed,
	loginSuccess
} from "../action";
import {
	Spin,
	Col
} from 'antd';
import '../login/login.less';

class MainView extends React.Component {

	componentDidMount() {
		const {
			checkAuthFailed,
			loginSuccess
		} = this.props;
		axiosGet({path: '/loggedin/'})
			.then(response => {
				loginSuccess(response);
			})
			.catch(error => {
				console.info(error);
				checkAuthFailed();
			});
	}

	render() {
		const {
			operatorInfo,
			lastUrl = '/new-messages',
			checkedAuth
		} = this.props;
		if (!checkedAuth) {
			return (
				<div className={'body-div'}>
					<Col className={'content'}>
						<Spin size={'large'}/>
					</Col>
				</div>)
		}
		return (
			<Switch>
				<Route exact path={'/'} render={props => {
					return operatorInfo ? <Redirect to={'/new-messages'}/> : <Redirect to={'/signin'} push/>;
				}}/>
				<Route exact path={'/signin'} render={props => {
					return operatorInfo ? <Redirect to={lastUrl} push/> : <Login prevState={props.location.state}/>;
				}}/>
				<Route exact path={'/new-messages'} render={props => {
					return !operatorInfo ? <Redirect to={{
						pathname: '/signin',
						state: {url: props.match.url}
					}}/> : <ChatLayout path={'new-messages'} match={props.match} status={'roomNew'}/>
				}}/>
				<Route exact path={'/new-messages/:id'} render={props => {
					return !operatorInfo ? <Redirect to={{
							pathname: '/signin',
							state: {url: props.match.url}
						}}/> :
						<ChatLayout path={'new-messages'} match={props.match} status={'roomNew'}/>
				}}/>
				<Route exact path={'/new-messages/:id/info'} render={props => {
					return !operatorInfo ? <Redirect to={{
							pathname: '/signin',
							state: {url: props.match.url}
						}}/> :
						<ChatLayout path={'new-messages'} match={props.match} status={'roomNew'}/>
				}}/>
				<Route exact path={'/active-messages'} render={props => {
					return !operatorInfo ? <Redirect to={{
							pathname: '/signin',
							state: {url: props.match.url}
						}}/> :
						<ChatLayout path={'active-messages'} match={props.match} status={'roomRecieved'}/>
				}}/>
				<Route exact path={'/active-messages/:id'} render={props => {
					return !operatorInfo ? <Redirect to={{
							pathname: '/signin',
							state: {url: props.match.url}
						}}/> :
						<ChatLayout path={'active-messages'} match={props.match} status={'roomRecieved'}/>
				}}/>
				<Route exact path={'/active-messages/:id/info'} render={props => {
					return !operatorInfo ? <Redirect to={{
							pathname: '/signin',
							state: {url: props.match.url}
						}}/> :
						<ChatLayout path={'active-messages'} match={props.match} status={'roomRecieved'}/>
				}}/>
				<Route exact path={'/closed-messages'} render={props => {
					return !operatorInfo ? <Redirect to={{
							pathname: '/signin',
							state: {url: props.match.url}
						}}/> :
						<ChatLayout path={'closed-messages'} match={props.match} status={'roomSend'}/>
				}}/>
				<Route exact path={'/closed-messages/:id'} render={props => {
					return !operatorInfo ? <Redirect to={{
							pathname: '/signin',
							state: {url: props.match.url}
						}}/> :
						<ChatLayout path={'closed-messages'} match={props.match} status={'roomSend'}/>
				}}/>
				<Route exact path={'/closed-messages/:id/info'} render={props => {
					return !operatorInfo ? <Redirect to={{
							pathname: '/signin',
							state: {url: props.match.url}
						}}/> :
						<ChatLayout path={'closed-messages'} match={props.match} status={'roomSend'}/>
				}}/>
			</Switch>
		);
	}
}

const mapStateToProps = state => ({
	operatorInfo: state.operatorInfo,
	lastUrl: state.lastUrl,
	checkedAuth: state.loginStatuses.checkedAuth
});

const mapDispatchToProps = dispatch => ({
	checkAuthFailed: () => dispatch(checkAuthFailed()),
	loginSuccess: (data) => dispatch(loginSuccess(data)),
	loginFailed: () => dispatch(loginFailed()),
})

export default withRouter(connect(
	mapStateToProps,
	mapDispatchToProps
)(MainView));

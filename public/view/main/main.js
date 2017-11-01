'use strict';

import React from 'react'
import {Route, Switch} from 'react-router-dom'
import ChatLayout from '../layout/layout'


export default class FullMainView extends React.Component {

	render() {
		return (
			<Switch>
				<Route exact path={'/'} render={(props) => {
					console.info(props);
					return <ChatLayout/>
				}}/>
				<Route path={'/new-messages'} render={(props) => {
					return <ChatLayout path={'new-messages'}/>
				}}/>
				<Route path={'/new-messages/:id'} render={(props) => {
					console.log(props);
					return <ChatLayout path={'new-messages'}/>
				}}/>
				<Route path={'/new-messages/:id/info'} render={(props) => {
					return <ChatLayout path={'new-messages'}/>
				}}/>
				<Route path={'/active-messages'} render={(props) => {
					return <ChatLayout path={'active-messages'}/>
				}}/>
				<Route path={'/active-messages/:id'} render={(props) => {
					return <ChatLayout path={'active-messages'}/>
				}}/>
				<Route path={'/active-messages/:id/info'} render={(props) => {
					return <ChatLayout path={'active-messages'}/>
				}}/>
				<Route path={'/closed-messages'} render={(props) => {
					return <ChatLayout path={'closed-messages'}/>
				}}/>
				<Route path={'/closed-messages/:id'} render={(props) => {
					return <ChatLayout path={'closed-messages'}/>
				}}/>
				<Route path={'/closed-messages/:id/info'} render={(props) => {
					return <ChatLayout path={'closed-messages'}/>
				}}/>
			</Switch>
		);
	}
}

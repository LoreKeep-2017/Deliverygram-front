'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {
	Card,
	Row
} from 'antd';
import './messages.less'
import moment from 'moment';
import Twemoji from 'react-twemoji';
import {makeImageFullScreen} from './action';


class MessagesInit extends React.Component {

	parseMessage(message) {
		if (message) {
			let parsed = [];
			while (message.indexOf('\n') > -1) {
				let breakPosition = message.indexOf('\n');
				parsed.push(message.substring(0, breakPosition));
				message = message.substring(breakPosition + 1);
			}
			parsed.push(message);
			parsed = parsed.map((item, position) => (<Row key={`message__row_${position}`}>{item}</Row>))
			return parsed;
		}
	}

	getMessages() {
		const {
			messages,
			selectedRoom,
			makeImageFullScreen
		} = this.props;
		if (messages[selectedRoom] && messages[selectedRoom][0].room === +selectedRoom) {
			return messages[selectedRoom].map((item, position) => {
				let image;
				if (item.imageUrl) {
					image = (
						<div className={`${item.author}-message-images`}
						     onClick={() => makeImageFullScreen(`${item.room}/${item.imageUrl}`)}>
							<img src={`${item.room}/${item.imageUrl}`}/>
						</div>
					)
				}
				return (
					<div className={`chat-card__${item.author}-message`} key={`chat_message_${position}`}>
						<div className={`${item.author}-message__position`}>
							{image}
							<p className={`${item.author}-message`} key={position}>{this.parseMessage(item.body)}</p>
						</div>
						<p className={'message__time'}
						   key={`message_${position}-time__${item.time}`}>{moment.unix(item.time).format('HH:mm')}</p>
					</div>
				)
			})
		}
	}

	// shouldComponentUpdate(nextProps) {
	// 	return nextProps.messages.length !== this.props.messages.length;
	// }

	render() {
		return (
			<Card className={'card-content'}
			      ref={card => {
				      if (card && card.container && card.container.children[0])
					      card.container.children[0].scrollTop = card.container.children[0].scrollHeight
			      }}>
				<Twemoji options={{className: 'twemoji'}}>
					{this.getMessages()}
				</Twemoji>
			</Card>
		);
	}
}

const mapStateToProps = state => ({
	messages: state.messages,
	selectedRoom: state.selectedRoom
});

const mapDispatchToProps = dispatch => ({
	makeImageFullScreen: (src) => dispatch(makeImageFullScreen(src)),
});

const Messages = connect(
	mapStateToProps,
	mapDispatchToProps
)(MessagesInit);

export default Messages;
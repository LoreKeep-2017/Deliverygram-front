'use strict';
import React from 'react';
import {connect} from 'react-redux';
import {
	Card,
	Row
} from 'antd';
import moment from 'moment';
import Twemoji from 'react-twemoji';


class MessagesInit extends React.Component {

	parseMessage(message) {
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

	getMessages() {
		const {
			messages
		} = this.props;
		if (messages) {
			return messages.map((item, position) => {
				return (
					<div className={`chat-card__${item.author}-message`} key={`chat_message_${position}`}>
						<div className={`${item.author}-message__position`}>
							<p className={`${item.author}-message`} key={position}>{this.parseMessage(item.body)}</p>
						</div>
						<p className={'message__time'}
						   key={`message_${position}-time__${item.time}`}>{moment.unix(item.time).format('HH:mm')}</p>
					</div>
				)})
		}
	}

	shouldComponentUpdate(nextProps){
		return nextProps.messages.length !== this.props.messages.length;
	}

	render () {
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
	messages: state.messages
});

const mapDispatchToProps = dispatch => ({});

const Messages = connect(
	mapStateToProps,
	mapDispatchToProps
)(MessagesInit);

export default Messages;

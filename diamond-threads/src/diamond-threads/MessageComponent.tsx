import './Message.css';

import {Message, ThreadDataManager} from './ThreadDataManager'

import React from 'react'

interface MessageProps {
	messageId: number,
	dataManager: ThreadDataManager,
	zIndex: number,
	depth: number,
	offsetHeight: number,
	//threadConfig: ThreadConfig,
}

interface MessageState {
	myOffsetHeight: number,
}

export default class MessageComponent extends React.Component<MessageProps, MessageState> {

	messageData: Message;
	myRef: React.Ref<HTMLDivElement>;

	state: MessageState = {
		myOffsetHeight: 0,
	}

	constructor(props: MessageProps) {
		super(props);

		this.messageData = props.dataManager.getMessageData(props.messageId);
		this.myRef = React.createRef<HTMLDivElement>()
	}

	componentDidMount() {
		let ref = this.myRef as any;

		if (ref.current) {
			this.setState({myOffsetHeight: ref.current.offsetHeight});
		}
	}

	getReplyComponents(): Array<React.ReactNode> {
		let replyIds = this.messageData.replies;

		return replyIds.map((id) => <MessageComponent 
			key={id} 
			messageId={id} 
			zIndex={this.props.zIndex - 1} 
			depth={this.props.depth + 1} 
			dataManager={this.props.dataManager}
			offsetHeight={this.props.offsetHeight + this.state.myOffsetHeight}
		/>)
	}

	render() {
		console.log(this.props.zIndex);
		const backgroundColor = `hsl(0, 0%, ${90 - (5 * this.props.depth)}%)`;
		return (
			<div className="message">
				<div className="messageBoxContainer" ref={this.myRef} style={{position: 'sticky', top: this.props.offsetHeight, zIndex: this.props.zIndex, }}>
					<div style={{padding: 10}}>
						<div className="messageBox" >
							{this.messageData.text}
						</div>
					</div>
				</div>
				
				{ this.messageData.replies.length > 0 ?
				<div className="repliesContainer">
					<div style={{width: 150,}}>
						
					</div>
					<div className="replies">
						{this.getReplyComponents()}
					</div>
				</div>
				: null}
			</div>
		)
	}
}
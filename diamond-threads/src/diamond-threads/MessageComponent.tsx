import './Message.css';

import {Message, ThreadDataManager} from './ThreadDataManager'

import React from 'react'

interface MessageProps {
	messageId: string,
	dataManager: ThreadDataManager,
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

			dataManager={this.props.dataManager}
			offsetHeight={this.props.offsetHeight + this.state.myOffsetHeight}
		/>);
	}

	render() {

		const backgroundColor = `hsl(0, 0%, ${85 - (10 * (this.messageData.depth % 2))}%)`;
		return (
			<div style={{display: 'flex', flexDirection: 'column', maxWidth: '100%'}}>
		
				<div className="message" 
					style={{
						backgroundColor: backgroundColor, 
						zIndex: this.messageData.depth,
						marginBottom: this.messageData.depth === 1 ? 5 : 0,
						paddingRight: 5,
						paddingBottom: 5,
						//outline: '1px solid slategray',
						boxShadow: '0px 0px 5px gray',
					}}>
					<div className="messageBoxContainer" 
						ref={this.myRef} 
						style={{
							position: 'sticky',
							top: this.props.offsetHeight, 
							backgroundColor: backgroundColor,
							zIndex: this.props.dataManager.getMaxDepth() * 2 - this.messageData.depth + 1,
						}}
					>
						<div style={{padding: 10,}}>
							<div className="messageBox" >
								<div className="commentMetadata">
									<b>{this.messageData.author}</b>
								</div>
								{this.messageData.text}
							</div>
						</div>
					</div>
					
					{ this.messageData.replies.length > 0 ?
					<div className="repliesContainer">
						<div style={{width: 50, minWidth: 50}}>
							
						</div>
						<div className="replies">
							{this.getReplyComponents()}
						</div>
					</div>
					: null}
				</div>
				
			</div>
		)
	}
}
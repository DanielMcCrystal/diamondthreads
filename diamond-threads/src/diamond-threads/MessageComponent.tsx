import './Message.css';

import {Message, ThreadDataManager} from './ThreadDataManager'

import React from 'react'

interface MessageProps {
	messageId: string,
	dataManager: ThreadDataManager,
	offsetHeight: number,

	parentMessage?: MessageComponent | null,
	//threadConfig: ThreadConfig,

}

interface MessageState {
	myMessageBoxContainerHeight: number,
	collapseHeight?: number,
	collapseOffset: number,
}

export default class MessageComponent extends React.Component<MessageProps, MessageState> {

	messageData: Message;

	myMessageRef: React.Ref<HTMLDivElement>;
	myMessageBoxContainerRef: React.Ref<HTMLDivElement>;

	lastCommentRef: React.Ref<MessageComponent>;

	state: MessageState = {
		myMessageBoxContainerHeight: 0,
		collapseOffset: 0,
	}

	collapseOffsetFromChild: number = 0;
	setCollapseOffset(collapseOffset: number) {
		this.collapseOffsetFromChild = collapseOffset;
	}


	constructor(props: MessageProps) {
		super(props);

		this.messageData = props.dataManager.getMessageData(props.messageId);
		
		this.myMessageRef = React.createRef<HTMLDivElement>();
		this.myMessageBoxContainerRef = React.createRef<HTMLDivElement>();

		this.lastCommentRef = React.createRef<MessageComponent>();
	}

	componentDidMount() {

		let myMessageRef = this.myMessageRef as any;
		let myMessageBoxContainerRef = this.myMessageBoxContainerRef as any;

		if (myMessageRef.current && myMessageBoxContainerRef.current) {
			let currentCollapseHeight = myMessageRef.current.offsetHeight;
			let newCollapseHeight = currentCollapseHeight + this.collapseOffsetFromChild;

			let parentCollapseOffset = newCollapseHeight - myMessageBoxContainerRef.current.offsetHeight;

			if (this.props.parentMessage) {
				this.props.parentMessage.setCollapseOffset(parentCollapseOffset);
			}
			
			this.setState({
				collapseHeight: newCollapseHeight,
				collapseOffset: this.collapseOffsetFromChild,
				myMessageBoxContainerHeight: myMessageBoxContainerRef.current.offsetHeight,
			})
		}
	}

	getReplyComponents(): Array<React.ReactNode> {
		let replyIds = this.messageData.replies;
		
		let sliceEnd = replyIds.length - 1;

		return replyIds.slice(0, sliceEnd).map((id) => <MessageComponent 
			key={id} 
			messageId={id} 

			dataManager={this.props.dataManager}
			offsetHeight={this.props.offsetHeight + this.state.myMessageBoxContainerHeight}
		/>);
	}

	getLastReplyComponent(backgroundColor: string): React.ReactNode {
		let replyIds = this.messageData.replies;
		if (replyIds.length === 0) {
			return null;
		}

		let id = replyIds[replyIds.length - 1];
		
		return (
			<div className="lastReply" style={{display: 'flex'}}>
				<div style={{width: 50, minWidth: 50, backgroundColor: backgroundColor}}/>
				<MessageComponent 
					ref={this.lastCommentRef}
					key={id} 
					messageId={id} 

					parentMessage={this}

					dataManager={this.props.dataManager}
					offsetHeight={this.props.offsetHeight + this.state.myMessageBoxContainerHeight}
				/>
			</div>
		);
	}

	render() {
		const backgroundColor = `hsl(0, 0%, ${85 - (10 * (this.messageData.depth % 2))}%)`;
		return (
			<div className="messageContainer" style={{zIndex: this.messageData.depth, marginBottom: this.messageData.depth === 1 ? 10 : 0}}>
		
				<div className="message" 
					ref={this.myMessageRef}
					style={{
						backgroundColor: backgroundColor, 
						
						paddingRight: 5,
						height: this.state.collapseHeight ? this.state.collapseHeight : 'auto',
						marginBottom: `${-this.state.collapseOffset}px`,
					}}
				>
					<div className="messageBoxContainer" 
						ref={this.myMessageBoxContainerRef} 
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
				{this.getLastReplyComponent(backgroundColor)}
			</div>
		)
	}
}
import MessageComponent from './MessageComponent'
import React from 'react'
import {ThreadDataManager} from './ThreadDataManager'

interface ThreadProps {

}

export default class Thread extends React.Component<ThreadProps> {

	dataManager: ThreadDataManager;
	scrollRef: React.Ref<HTMLDivElement>;

	constructor(props: ThreadProps) {
		super(props);

		this.dataManager = new ThreadDataManager();

		this.dataManager.addTestConversation(100);
		//this.dataManager.addShallowConversation(10, 10);

		this.scrollRef = React.createRef();
		
	}


	onScroll = () => {
		console.log("Something");
		console.log(window.scrollY)
	}

	getMessageComponents(): Array<React.ReactNode> {
		let messageIds = this.dataManager.getRootMessageIds();

		return messageIds.map((id) => <MessageComponent key={id} offsetHeight={0} messageId={id} zIndex={0} depth={0} dataManager={this.dataManager}/>)
	}
	

	render() {
		return (
			<div style={{display: 'flex', flexDirection: 'column', padding: 20, width: '50%', backgroundColor: 'red',}} onScroll={this.onScroll}>
				{this.getMessageComponents()}
			</div>
		);
	}
}
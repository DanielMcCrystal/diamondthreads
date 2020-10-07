import MessageComponent from './MessageComponent'
import React from 'react'
import RedditManager from './RedditManager';
import {ThreadDataManager} from './ThreadDataManager'

interface ThreadProps {
	submissionId: string,
}

export default class Thread extends React.Component<ThreadProps> {

	dataManager: ThreadDataManager;
	redditManager: RedditManager;
	scrollRef: React.Ref<HTMLDivElement>;

	constructor(props: ThreadProps) {
		super(props);

		this.dataManager = new ThreadDataManager();
		this.redditManager = new RedditManager(this.dataManager);

		this.scrollRef = React.createRef();
		
	}

	componentDidMount() {
		this.redditManager.fetchPost(this.props.submissionId, () => {
			this.dataManager.markReady();
			this.forceUpdate();
		})
	}

	getMessageComponents(): Array<React.ReactNode> {
		let messageIds = this.dataManager.getRootMessageIds();

		return messageIds.map((id) => <MessageComponent key={id} offsetHeight={0} messageId={id} dataManager={this.dataManager}/>)
	}
	

	render() {
		return (
			<div style={{display: 'flex', flexDirection: 'column', width: '90%'}}>
				{this.dataManager.isReady() ? this.getMessageComponents() : null}
			</div>
		);
	}
}
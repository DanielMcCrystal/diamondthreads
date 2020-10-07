import { Button, TextInput } from 'evergreen-ui';

import React from 'react';
import Thread from './diamond-threads/Thread'

interface ThreadClientState {
	lastSubmissionId: string | null,
}

export default class ThreadClient extends React.Component {

	state: ThreadClientState = {
		lastSubmissionId: null,
	}

	enteredURL: string = '';
	submitURL() {
		let commentsIndex = this.enteredURL.indexOf('/comments/');
		if (commentsIndex === -1) {
			return;
		}
		
		let submissionId = this.enteredURL.substr(commentsIndex + 10, 6);
		this.setState({
			lastSubmissionId: submissionId,
		})
	}

	render(): React.ReactNode {
		return (
			<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
				<div style={{alignSelf: 'stretch', height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<div style={{display: 'flex', alignItems: 'center'}}>
						<TextInput 
							placeholder={"Enter a reddit URL"}
							width={800}
							height={60}

							onChange={(e: any) => {
								this.enteredURL = e.target.value;
							}}
	
							style={{marginRight: 20}}
						/>
						<Button appearance={'primary'} height={56} onClick={() => {this.submitURL()}}>Go</Button>
					</div>
				</div>
				{this.state.lastSubmissionId ? <Thread submissionId={this.state.lastSubmissionId} /> : null}
			</div>
			
		);
	}
}

export interface Message {
	id: number,
	text: string,
	replyTo?: number | null,
	replies: Array<number>,
}

interface MessageStore {
	[id: number]: Message,
}

export class ThreadDataManager {
	currentMessageId: number = 0;

	rootMessages: Set<number> = new Set();
	allMessages: MessageStore = {};

	getMessageData(id: number): Message {
		return this.allMessages[id];
	}

	getRootMessageIds(): Array<number> {
		return Array.from(this.rootMessages);
	}

	createNewMessage(text: string, replyToId?: number | null): Message {
		let id = this.currentMessageId;
		this.currentMessageId += 1;

		return {
			id: id,
			text: text,
			replyTo: replyToId,
			replies: [],
		}
	}

	addTestConversation(n: number): void {
		const testContent = 'TEST';
		const maxWordsPerLine = 10;
		const maxLines = 10;

		for (let i = 0; i < n; i++) {
			let numMessages = Object.keys(this.allMessages).length;

			let testMessage = '';
			let numLines = Math.floor(Math.random() * maxLines) + 1;
			for (let j = 0; j < numLines; j++) {
				let numWords = Math.floor(Math.random() * maxWordsPerLine) + 1;

				for (let k = 0; k < numWords; k++) {
					testMessage += testContent + ' ';
				}

				testMessage += '\n';
			}

			let rand = Math.floor(Math.random() * (numMessages + 1));
			if (rand >= numMessages) {
				this.addRootMessage(testMessage);
			} else {
				this.addReply(testMessage, rand);
			}
		}	
	}

	addShallowConversation(numRoots: number, numReplies: number): void {
		const testContent = "TEST";

		for(let i = 0; i < numRoots; i++) {
			let rootId = this.addRootMessage(testContent)
			for (let j = 0; j < numReplies; j++ ) {
				this.addReply(testContent, rootId);
			}
		}
	}

	addRootMessage(text: string): number {
		let message = this.createNewMessage(text);

		this.rootMessages.add(message.id);
		this.allMessages[message.id] = message;

		return message.id;
	}

	addReply(text: string, replyToId: number): number {
		let message = this.createNewMessage(text, replyToId);

		this.allMessages[message.id] = message;
		this.allMessages[replyToId].replies.push(message.id);

		return message.id;
	}
}
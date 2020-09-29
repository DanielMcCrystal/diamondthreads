
export interface Message {
	id: string,
	text: string,
	author: string,
	replyTo?: string | null,
	replies: Array<string>,
	depth: number,
}

interface MessageStore {
	[id: string]: Message,
}

export class ThreadDataManager {
	currentMessageId: number = 0;

	rootMessages: Set<string> = new Set();
	allMessages: MessageStore = {};

	private maxDepth: number = 0;
	getMaxDepth(): number {
		return this.maxDepth;
	}

	getMessageData(id: string): Message {
		return this.allMessages[id];
	}

	getRootMessageIds(): Array<string> {
		return Array.from(this.rootMessages);
	}

	createNewMessage(author: string, text: string, replyToId?: string | null, id?: string | null): Message {
		if (!id) {
			id = this.currentMessageId.toString();
			this.currentMessageId += 1;
		}
		

		let depth = 1;

		if (replyToId !== null && replyToId !== undefined) {
			let parentMessage = this.getMessageData(replyToId);
			depth = parentMessage.depth + 1;

			if (depth > this.maxDepth) {
				this.maxDepth = depth;
			}
		}
		

		return {
			id: id,
			text: text,
			author: author,
			replyTo: replyToId,
			replies: [],
			depth: depth,
		}
	}


	addRootMessage(author: string, text: string, id?: string | null): string {
		let message = this.createNewMessage(author, text, null, id);

		this.rootMessages.add(message.id);
		this.allMessages[message.id] = message;

		return message.id;
	}

	addReply(author: string, text: string, replyToId: string, id?: string | null): string {
		let message = this.createNewMessage(author, text, replyToId, id);

		this.allMessages[message.id] = message;
		this.allMessages[replyToId].replies.push(message.id);

		return message.id;
	}

	private ready: boolean = false;
	markReady() {
		this.ready = true;
	}

	isReady() {
		return this.ready;
	}
}
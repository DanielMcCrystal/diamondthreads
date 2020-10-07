import Snoowrap from "snoowrap";
import { ThreadDataManager } from "./ThreadDataManager";

const snoowrap = require('snoowrap');

export default class RedditManager {

	sr: Snoowrap;
	dataManager: ThreadDataManager;

	constructor(dataManager: ThreadDataManager) {
		this.sr = new snoowrap({
			clientId: '4hLFsXj1w7VJ5Q',
			clientSecret: 'fcn8ceF26gEvGFJpCTuuAM0MbAE',
			refreshToken: '12080383-eFbYr4gUAfbeeNx_PIDu8CtBGXI',
		});

		this.dataManager = dataManager;
	}

	populateComments(post: Snoowrap.Submission) {
		post.comments.forEach((comment) => {
			this.postRootComment(comment);
		})
	}

	postRootComment(comment: Snoowrap.Comment) {
		let rootId = this.dataManager.addRootMessage(comment.author.name, comment.body, comment.id);
		comment.replies.forEach((reply) => {
			this.postReply(reply, rootId);
		})
	}

	postReply(comment: Snoowrap.Comment, replyToId: string) {
		let parentId = this.dataManager.addReply(comment.author.name, comment.body, replyToId, comment.id);
		
		comment.replies.forEach((reply) => {
			this.postReply(reply, parentId);
		})
	}

	async fetchPost(submissionId: string, callback: () => void) {
		// submissionId = 'j19mct';
		this.sr.getSubmission(submissionId).fetch().then((post) => {
			this.populateComments(post);
			callback();
		}).catch((reason: any) => {
			console.log(reason);
		});

	}
}
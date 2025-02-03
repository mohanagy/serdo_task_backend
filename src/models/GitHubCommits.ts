import { Schema, model } from "mongoose";
import { GitHubCommitsDocument } from '../interfaces/github';


const GitHubCommitsSchema = new Schema({
  sha: { type: String, },
  node_id: { type: String, },
  commit: { type: Object, },
  url: { type: String, },
  html_url: { type: String, },
  comments_url: { type: String, },
  author: { type: Object, },
  committer: { type: Object, },
  parents: { type: Array, },
  repoId: { type: String, required: true },
  fetchedAt: { type: Date, required: true },
  userId: { type: String, required: true },
}, { versionKey: false });

export const GitHubCommits = model<GitHubCommitsDocument>("GitHubCommits", GitHubCommitsSchema);

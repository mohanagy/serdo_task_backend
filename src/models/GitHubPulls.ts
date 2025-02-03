import { Schema, model } from "mongoose";
import { GitHubPullsDocument } from '../interfaces/github';


const GitHubPullsSchema = new Schema({
  url: { type: String },
  id: { type: Number },
  node_id: { type: String },
  html_url: { type: String },
  diff_url: { type: String },
  patch_url: { type: String },
  issue_url: { type: String },
  number: { type: Number },
  state: { type: String },
  locked: { type: Boolean },
  title: { type: String },
  user: { type: Object },
  body: { type: String },
  created_at: { type: Date },
  updated_at: { type: Date },
  closed_at: { type: Date },
  merged_at: { type: Date },
  language: { type: String },
  merge_commit_sha: { type: String },
  assignee: { type: Object },
  assignees: { type: Array },
  requested_reviewers: { type: Array },
  requested_teams: { type: Array },
  labels: { type: Array },
  milestone: { type: Schema.Types.Mixed },
  active_lock_reason: { type: String },
  head: { type: Object },
  base: { type: Object },
  _links: { type: Object },
  author_association: { type: String },
  auto_merge: { type: Schema.Types.Mixed },
  draft: { type: Boolean },
  fetchedAt: { type: Date, required: true },
  userId: { type: String, required: true },
  repoId: { type: String, required: true },
}, { versionKey: false });

export const GitHubPulls = model<GitHubPullsDocument>("GitHubPulls", GitHubPullsSchema);
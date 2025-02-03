import { Schema, model } from "mongoose";
import { GitHubIssuesDocument } from '../interfaces/github';


const GitHubIssuesSchema = new Schema({
  url: { type: String, },
  repository_url: { type: String, },
  labels_url: { type: String, },
  comments_url: { type: String, },
  events_url: { type: String, },
  html_url: { type: String, },
  id: {
    type: Number
  },
  node_id: { type: String, },
  number: { type: Number },
  title: { type: String, },
  user: {
    login: { type: String, },
    id: { type: String, },
    node_id: { type: String, },
    avatar_url: { type: String, },
    gravatar_id: { type: String, },
    url: { type: String, },
    html_url: { type: String, },
    followers_url: { type: String, },
    following_url: { type: String, },
    gists_url: { type: String, },
    starred_url: { type: String, },
    subscriptions_url: { type: String, },
    organizations_url: { type: String, },
    repos_url: { type: String, },
    events_url: { type: String, },
    received_events_url: { type: String, },
    type: { type: String, },
    user_view_type: { type: String, },
    site_admin: { type: Boolean }
  },
  labels: [],
  state: { type: String, },
  locked: { type: Boolean },
  assignee: {},
  assignees: [],
  milestone: {},
  comments: { type: Number },
  created_at: { type: String, },
  updated_at: { type: String, },
  closed_at: { type: String, },
  author_association: { type: String, },
  active_lock_reason: { type: String, },
  body: { type: String, },
  closed_by: {},
  reactions: {
    url: { type: String, },
    total_count: { type: Number },
    '+1': { type: Number },
    '-1': { type: Number },
    laugh: { type: Number },
    hooray: { type: Number },
    confused: { type: Number },
    heart: { type: Number },
    rocket: { type: Number },
    eyes: { type: Number }
  },
  timeline_url: { type: String, },
  performed_via_github_app: { type: String, },
  state_reason: { type: String, },
  fetchedAt: { type: Date, required: true },
  userId: { type: String, required: true },
  repoId: { type: String, required: true },
}, { versionKey: false });

export const GitHubIssues = model<GitHubIssuesDocument>("GitHubIssues", GitHubIssuesSchema);

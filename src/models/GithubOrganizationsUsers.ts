import { Schema, model } from "mongoose";
import { GithubOrganizationsUsersDocument } from '../interfaces/github';


const GithubOrganizationsUsersSchema = new Schema({
  login: { type: String },
  id: { type: String },
  node_id: { type: String },
  avatar_url: { type: String },
  gravatar_id: { type: String },
  url: { type: String },
  html_url: { type: String },
  followers_url: { type: String },
  following_url: { type: String },
  gists_url: { type: String },
  starred_url: { type: String },
  subscriptions_url: { type: String },
  organizations_url: { type: String },
  repos_url: { type: String },
  events_url: { type: String },
  received_events_url: { type: String },
  type: { type: String },
  site_admin: { type: Boolean },
  userId: { type: String, required: true },
  fetchedAt: { type: Date, required: true },
  orgId: { type: String, required: true },
}, { versionKey: false });

export const GithubOrganizationsUsers = model<GithubOrganizationsUsersDocument>(
  "GithubOrganizationsUsers",
  GithubOrganizationsUsersSchema,
);

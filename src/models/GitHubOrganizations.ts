import { Schema, model } from "mongoose";
import { GitHubOrganizationsDocument } from '../interfaces/github';



const GitHubOrganizationsSchema = new Schema({
  avatar_url: { type: String, },
  description: { type: String, },
  events_url: { type: String, },
  hooks_url: { type: String, },
  id: { type: Number, required: true },
  issues_url: { type: String, },
  login: { type: String, required: true },
  members_url: { type: String, },
  node_id: { type: String, },
  public_members_url: { type: String, },
  repos_url: { type: String, },
  url: { type: String, },
  userId: { type: String, required: true },
  fetchedAt: { type: Date, required: true },
}, { versionKey: false });

export const GitHubOrganizations = model<GitHubOrganizationsDocument>(
  "GitHubOrganizations",
  GitHubOrganizationsSchema,
);

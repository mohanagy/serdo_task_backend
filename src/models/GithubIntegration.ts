import { Schema, model } from "mongoose";
import { GithubIntegrationDocument } from '../interfaces/github';


const GithubIntegrationSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  accessToken: { type: String, required: true },
  connectedAt: { type: Date, required: true },
}, { versionKey: false });

export const GithubIntegration = model<GithubIntegrationDocument>(
  "gtihub-integration",
  GithubIntegrationSchema,
);

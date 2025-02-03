import { Schema, model } from "mongoose";
import { AirtableIntegrationDocument } from '../interfaces/airtable';


const AirtableIntegrationSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  displayName: { type: String, required: true },
  accessToken: { type: String, required: true },
  connectedAt: { type: Date, required: true },
}, { versionKey: false });

export const AirtableIntegration = model<AirtableIntegrationDocument>(
  "airtable-integration",
  AirtableIntegrationSchema,
);

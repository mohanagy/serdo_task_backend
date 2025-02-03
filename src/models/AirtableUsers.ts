import { Schema, model } from "mongoose";
import { AirtableUsersDocument } from '../interfaces/airtable';


const AirtableUsersSchema = new Schema({
  id: { type: String, required: true },
  meta: {
    created: { type: Date, required: true },
    location: { type: String, required: true },
    resourceType: { type: String, required: true },
  },
  name: {
    familyName: { type: String, required: true },
    givenName: { type: String, required: true },
  },
  schemas: { type: [String], required: true },
  userName: { type: String, required: true },
  userId: { type: String, required: true },
  fetchedAt: { type: Date, required: true },
}, { versionKey: false });

export const AirtableUsers = model<AirtableUsersDocument>(
  "AirtableUsers",
  AirtableUsersSchema,
);


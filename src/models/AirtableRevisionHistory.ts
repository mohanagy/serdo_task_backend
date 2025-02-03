import { Schema, model } from "mongoose";
import { AirtableRevisionHistoryDocument } from '../interfaces/airtable';



const AirtableRevisionHistorySchema = new Schema({
  uuid: { type: String, required: true },
  issueId: { type: String, required: true },
  columnType: { type: String, required: false },
  oldValue: { type: String, required: false },
  newValue: { type: String, required: false },
  createdDate: { type: Date, required: true },
  authoredBy: { type: String, required: false },
  userId: { type: String, required: true },
}, { versionKey: false });

export const AirtableRevisionHistory = model<AirtableRevisionHistoryDocument>(
  "AirtableRevisionHistory",
  AirtableRevisionHistorySchema,
);


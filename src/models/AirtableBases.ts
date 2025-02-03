import { Schema, model } from "mongoose";
import { AirtableBasesDocument } from '../interfaces/airtable';



const AirtableBasesSchema = new Schema({
  id: { type: String, required: false },
  name: { type: String, required: false },
  permissionLevel: { type: String, required: false },
  userId: { type: String, required: true },
  fetchedAt: { type: Date, required: true },
}, { versionKey: false });

export const AirtableBases = model<AirtableBasesDocument>(
  "AirtableBases",
  AirtableBasesSchema,
);

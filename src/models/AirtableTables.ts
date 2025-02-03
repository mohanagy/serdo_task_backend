import { Schema, model } from "mongoose";
import { AirtableTablesDocument } from '../interfaces/airtable';



const AirtableTablesSchema = new Schema({
  description: { type: String, required: false },
  fields: {
    type:
      [{
        description: { type: String, required: false },
        id: { type: String, required: false },
        name: { type: String, required: false },
        type: { type: String, required: false },
        options: {
          type:
          {
            isReversed: { type: Boolean, required: false },
            inverseLinkFieldId: { type: String, required: false },
            linkedTableId: { type: String, required: false },
            prefersSingleRecordLink: { type: Boolean, required: false },
          }, required: false
        },
      }]
    , required: false
  },
  id: { type: String, required: false },
  name: { type: String, required: false },
  primaryFieldId: { type: String, required: false },
  views: {
    type:
      [{
        id: { type: String, required: false },
        name: { type: String, required: false },
        type: { type: String, required: false },
      }]
    , required: false
  },
  baseId: { type: String, required: true },
  userId: { type: String, required: true },
  fetchedAt: { type: Date, required: true },
}, { versionKey: false });

export const AirtableTables = model<AirtableTablesDocument>(
  "AirtableTables",
  AirtableTablesSchema,
);


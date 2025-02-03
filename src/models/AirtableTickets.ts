import { Schema, model } from "mongoose";
import { AirtableTicketsDocument } from '../interfaces/airtable';



const AirtableTicketsSchema = new Schema({
  id: { type: String, required: false },
  createdAt: { type: Date, required: false },
  fields: {
    type:
    {
      Address: { type: String, required: false },
      Name: { type: String, required: false },
      Visited: { type: Boolean, required: false },
    }
    , required: false
  },
  baseId: { type: String, required: true },
  tableId: { type: String, required: true },
  userId: { type: String, required: true },
  fetchedAt: { type: Date, required: true },
}, { versionKey: false });

export const AirtableTickets = model<AirtableTicketsDocument>(
  "AirtableTickets",
  AirtableTicketsSchema,
);


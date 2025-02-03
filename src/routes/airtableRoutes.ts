import express from "express";
import { getAirtableBases, getAirtableTables, getAirtableTickets, getAirtableRevisionHistory } from "../controllers/airtableController";
import { isAuthenticated } from '../middleware/isAuthenticated';

const router = express.Router();

router
  .use("/airtable", router)
  .get('/bases', isAuthenticated, getAirtableBases)
  .get('/tables', isAuthenticated, getAirtableTables)
  .get('/tickets', isAuthenticated, getAirtableTickets)
  .get('/revision', isAuthenticated, getAirtableRevisionHistory)
export const airtableRoutes = router;

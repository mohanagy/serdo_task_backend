import { handleAirtableCallback } from './../controllers/airtableController';
import express from "express";
import passport from "passport";
import { handleGitHubCallback, logoutFromGithub, loginUsingAirtable, getIntegrations, logoutFromAirtable } from "../controllers/authController";
import { isAuthenticated } from '../middleware/isAuthenticated';

const router = express.Router();

router
  .use("/auth", router)
  .get('/me', isAuthenticated, getIntegrations)
  .get("/github", passport.authenticate("github", { scope: ["user", "repo"] }))
  .get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), handleGitHubCallback)
  .get('/airtable', loginUsingAirtable)
  .get("/airtable/callback", handleAirtableCallback)
  .delete("/github/logout", isAuthenticated, logoutFromGithub)
  .delete('/airtable/logout', isAuthenticated, logoutFromAirtable);
export const authRoutes = router;

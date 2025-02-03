import express from "express";
import { getCommits, getIssues, getOrganizations, getPulls, getRepos, getOrganizationsUsers, getCompletedIssues } from "../controllers/githubController";
import { isAuthenticated } from '../middleware/isAuthenticated';

const router = express.Router();

router
  .use("/github", router)
  .get("/organizations", isAuthenticated, getOrganizations)
  .get("/repos", isAuthenticated, getRepos)
  .get("/commits", isAuthenticated, getCommits)
  .get("/pulls", isAuthenticated, getPulls)
  .get("/issues/completed", isAuthenticated, getCompletedIssues)
  .get("/issues", isAuthenticated, getIssues)
  .get("/organizations-users", isAuthenticated, getOrganizationsUsers)

export const githubRoutes = router;

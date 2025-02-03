import { generateCodeChallenge } from './../utils/helpers';
import { Request, Response } from "express";
import { fetchGithubData } from "../services/github";
import { GitHubOrganizations } from "../models/GitHubOrganizations";
import { GitHubRepos } from "../models/GitHubRepos";
import { GitHubCommits } from "../models/GitHubCommits";
import { GitHubIssues } from "../models/GitHubIssues";
import { GitHubPulls } from "../models/GitHubPulls";
import { GITHUB_ENDPOINTS } from "../interfaces/github";
import { GithubIntegration } from '../models/GithubIntegration';
import { AirtableIntegration } from '../models/AirtableIntegration';
import util from 'util'
import { GithubOrganizationsUsers } from '../models/GithubOrganizationsUsers';
import config from '../config';
import { generateCodeVerifier, } from '../utils/helpers';
import { randomBytes } from 'crypto';
util.inspect.defaultOptions.depth = null;
util.inspect.defaultOptions.breakLength = Infinity;
util.inspect.defaultOptions.colors = true;
util.inspect.defaultOptions.maxArrayLength = null;
export const handleGitHubCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accessToken, id } = req.user || {};
    if (!accessToken || !id) {
      res.status(400).json({ error: "User authentication failed" });
      return;
    }
    // void deleteGithubDataByUserId(id);
    // void fetchData(accessToken, id)
    res.redirect(`http://localhost:4200/home`);

    return;
  } catch (error: any) {
    res.status(500).json({ error: error.message });
    return;
  }
};


export const fetchData = async (accessToken: string, id: string) => {
  try {
    const orgs = await fetchGithubData(GITHUB_ENDPOINTS.ORGS, "", "", "", accessToken);
    const orgsData = orgs.map((org: any) => ({
      ...org,
      fetchedAt: new Date(),
      userId: id,
    }));
    await GitHubOrganizations.create(orgsData);

    for await (const org of orgs) {
      let page = 1;
      let repos;
      do {
        repos = await fetchGithubData(GITHUB_ENDPOINTS.REPOS, org.login, "", "", accessToken, page);
        const reposData = repos.map((repo: any) => ({
          ...repo,
          fetchedAt: new Date(),
          userId: id,
          orgId: org.id,
        }));
        await GitHubRepos.create(reposData);

        for await (const repo of repos) {
          let pullPage = 1;
          let pulls;
          do {
            pulls = await fetchGithubData("pullRequests", org.login, repo.name, "", accessToken, pullPage);
            const pullsData = pulls.map(({ language, ...pull }: any) => {
              delete pull.head;
              delete pull.base;

              return {
                ...pull,
                fetchedAt: new Date(),
                userId: id,
                repoId: repo.id,
              };
            });
            await GitHubPulls.create(pullsData);
            pullPage++;
          } while (pulls.length > 0);

          let commitPage = 1;
          let commits;
          do {
            commits = await fetchGithubData(GITHUB_ENDPOINTS.COMMITS, org.login, repo.name, "", accessToken, commitPage);
            const commitsData = commits.map((commit: any) => ({
              ...commit,
              fetchedAt: new Date(),
              userId: id,
              repoId: repo.id,
            }));
            await GitHubCommits.create(commitsData);
            commitPage++;
          } while (commits.length > 0);

          let issuePage = 1;
          let issues;
          do {
            issues = await fetchGithubData(GITHUB_ENDPOINTS.ISSUES, org.login, repo.name, "", accessToken, issuePage);
            const issuesData = issues.map((issue: any) => ({
              ...issue,
              fetchedAt: new Date(),
              userId: id,
              repoId: repo.id,
            }));
            await GitHubIssues.create(issuesData);
            issuePage++;
          } while (issues.length > 0);
        }
        page++;
      } while (repos.length > 0);

      let memberPage = 1;
      let members;
      do {
        members = await fetchGithubData(GITHUB_ENDPOINTS.ORGS_USERS, org.login, "", "", accessToken, memberPage);
        const membersData = members.map((member: any) => ({
          ...member,
          fetchedAt: new Date(),
          userId: id,
          orgId: org.id,
        }));
        await GithubOrganizationsUsers.create(membersData);
        memberPage++;
      } while (members.length > 0);
    }
  } catch (error) {
    console.log('error in fetching data:', error);
  }
}

export const logoutFromGithub = async (req: Request, res: Response): Promise<void> => {
  try {
    const { accessToken } = req.user || {};
    if (!accessToken) {
      res.status(400).json({ error: "User authentication failed" });
      return;
    }
    await GitHubOrganizations.deleteMany({ userId: req.user?.userId });
    await GitHubRepos.deleteMany({ userId: req.user?.userId });
    await GitHubCommits.deleteMany({ userId: req.user?.userId });
    await GitHubPulls.deleteMany({ userId: req.user?.userId });
    await GitHubIssues.deleteMany({ userId: req.user?.userId });
    await GithubOrganizationsUsers.deleteMany({ userId: req.user?.userId });

    await GithubIntegration.deleteMany({ userId: req.user?.userId })



    res.status(200).json({ message: "User logged out successfully" });
  }
  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteGithubDataByUserId = async (userId: string) => {
  try {
    await GitHubOrganizations.deleteMany({ userId });
    await GitHubRepos.deleteMany({ userId });
    await GitHubCommits.deleteMany({ userId });
    await GitHubPulls.deleteMany({ userId });
    await GitHubIssues.deleteMany({ userId });
    await GithubOrganizationsUsers.deleteMany({ userId });

  }
  catch (error) {
    console.log('error in deleting data:', error);
  }
}


export const loginUsingAirtable = async (req: Request, res: Response): Promise<void> => {
  try {
    const state = crypto.randomUUID()
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier)

    req.session.codeVerifier = codeVerifier;
    req.session.state = state;
    const { airtable: { clientId, redirectUri, scope } } = config
    const authorizeUrl = `https://airtable.com/oauth2/v1/authorize?response_type=code`
      + `&client_id=${clientId}`
      + `&redirect_uri=${encodeURIComponent(redirectUri)}`
      + `&scope=${encodeURIComponent(scope)}`
      + `&state=${encodeURIComponent(state)}`
      + `&code_challenge_method=S256`
      + `&code_challenge=${codeChallenge}`;
    return res.redirect(authorizeUrl);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const getIntegrations = async (req: Request, res: Response): Promise<void> => {
  try {
    const githubIntegrations = await GithubIntegration.findOne({ userId: req.user?.userId });
    const airtableIntegrations = await AirtableIntegration.findOne({ userId: req.user?.userId });
    res.status(200).json({ github: githubIntegrations, airtable: airtableIntegrations, user: req.user });
  }
  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
export const logoutFromAirtable = async (req: Request, res: Response): Promise<void> => {
  try {
    await AirtableIntegration.deleteMany({ userId: req.user?.userId })
    res.status(200).json({ message: "User logged out successfully" });
  }
  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}


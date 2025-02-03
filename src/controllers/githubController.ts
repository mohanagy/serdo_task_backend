import { Request, Response } from "express";
import { GitHubOrganizations } from "../models/GitHubOrganizations";
import { GitHubRepos } from "../models/GitHubRepos";
import { GitHubCommits } from "../models/GitHubCommits";
import { GitHubIssues } from "../models/GitHubIssues";
import { GitHubPulls } from "../models/GitHubPulls";
import { getPagination } from '../utils/pagination';
import { FILTER_INTERFACE } from '../interfaces/github';
import { GithubOrganizationsUsers } from "../models/GithubOrganizationsUsers";
import { flattenObject } from '../utils/helpers';


export const getOrganizations = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = req.query
    const { limit, skip } = getPagination(page as string, pageSize as string);

    const searchTerm = (req.query.searchTerm as string) || '';
    let filter: FILTER_INTERFACE = { userId: req.user?.userId };

    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    const totalCount = await GitHubOrganizations.countDocuments(filter);
    const data = await GitHubOrganizations
      .find(filter)
      .limit(limit)
      .skip(skip);


    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ totalCount, data: flattenedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRepos = async (req: Request, res: Response) => {
  try {

    const { page, pageSize } = req.query
    const { limit, skip } = getPagination(page as string, pageSize as string);
    const searchTerm = (req.query.searchTerm as string) || '';
    let filter: FILTER_INTERFACE = { userId: req.user?.userId };
    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    const totalCount = await GitHubRepos.countDocuments(filter);
    const data = await GitHubRepos
      .find(filter)
      .limit(limit)
      .skip(skip);

    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ totalCount, data: flattenedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommits = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = req.query
    const { limit, skip } = getPagination(page as string, pageSize as string);

    const searchTerm = (req.query.searchTerm as string) || '';
    let filter: FILTER_INTERFACE = { userId: req.user?.userId };
    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    const totalCount = await GitHubCommits.countDocuments(filter);
    const data = await GitHubCommits
      .find(filter)
      .limit(limit)
      .skip(skip);

    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ totalCount, data: flattenedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPulls = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = req.query
    const { limit, skip } = getPagination(page as string, pageSize as string);

    const searchTerm = (req.query.searchTerm as string) || '';
    let filter: FILTER_INTERFACE = { userId: req.user?.userId };
    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    const totalCount = await GitHubPulls.countDocuments(filter);
    const data = await GitHubPulls
      .find(filter)
      .limit(limit)
      .skip(skip);

    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ totalCount, data: flattenedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getIssues = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = req.query
    const { limit, skip } = getPagination(page as string, pageSize as string);

    const searchTerm = (req.query.searchTerm as string) || '';
    let filter: FILTER_INTERFACE = { userId: req.user?.userId };
    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    const totalCount = await GitHubIssues.countDocuments(filter);
    const data = await GitHubIssues
      .find(filter)
      .limit(limit)
      .skip(skip);

    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ totalCount, data: flattenedData });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrganizationsUsers = async (req: Request, res: Response) => {
  try {
    const { page, pageSize } = req.query
    const { limit, skip } = getPagination(page as string, pageSize as string);

    const searchTerm = (req.query.searchTerm as string) || '';
    let filter: FILTER_INTERFACE = { userId: req.user?.userId };
    if (searchTerm) {
      filter.$text = { $search: searchTerm };
    }

    const totalCount = await GithubOrganizationsUsers.countDocuments(filter);
    const data = await GithubOrganizationsUsers
      .find(filter)
      .limit(limit)
      .skip(skip);

    const flattenedData = data.map((doc) => flattenObject(doc.toJSON()));
    res.json({ totalCount, data: flattenedData });
  }
  catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export const getCompletedIssues = async (req: Request, res: Response) => {
  try {
    const { page, pageSize, user, repo, startDate, endDate, search } = req.query;

    const { limit, skip } = getPagination(page as string, pageSize as string);


    const filters: any = { state: "closed" };
    if (user) filters["user.login"] = new RegExp(user as string, "i");
    if (repo) filters.repoId = new RegExp(repo as string, "i");
    if (startDate || endDate) {
      filters.closed_at = {};
      if (startDate) filters.closed_at.$gte = new Date(startDate as string);
      if (endDate) filters.closed_at.$lte = new Date(endDate as string);
    }
    if (search) {
      filters.$or = [
        { title: new RegExp(search as string, "i") },
        { "user.login": new RegExp(search as string, "i") },
        { "body": new RegExp(search as string, "i") },
      ];
    }

    const totalCount = await GitHubIssues.countDocuments(filters);
    const issues = await GitHubIssues.find(filters)
      .limit(limit)
      .skip(skip)
      .lean();


    const transformedIssues = issues.map((issue) => ({
      ticketId: issue.id,
      title: issue.title,
      user: issue.user?.login,
      closed_at: issue.closed_at,
      state_reason: issue.state_reason,
      body: issue.body,
    }));

    res.json({ totalCount, data: transformedIssues });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
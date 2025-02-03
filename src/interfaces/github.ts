import { Document } from "mongoose";

export interface GITHUB_ENDPOINTS_INTERFACE {
  orgs: (org: string, repo: string, issueNumber: string, perPage?: number, page?: number) => string;
  repos: (org: string, repo: string, issueNumber: string, perPage?: number, page?: number) => string;
  commits: (org: string, repo: string, issueNumber: string, perPage?: number, page?: number) => string;
  issues: (org: string, repo: string, issueNumber: string, perPage?: number, page?: number) => string;
  pullRequests: (org: string, repo: string, issueNumber: string, perPage?: number, page?: number) => string;
  orgsUsers: (org: string, repo: string, issueNumber: string, perPage?: number, page?: number) => string;
}
export type githubEndpoint = (params: { org: string, repo: string, perPage?: number, page?: number }) => string;

export interface GitHubProfile {
  id: string;
  username: string;
}

export interface GithubIntegrationDocument {
  userId: string;
  username: string;
  accessToken: string;
  connectedAt: Date;
}

export enum GITHUB_ENDPOINTS {
  ORGS = "orgs",
  REPOS = "repos",
  COMMITS = "commits",
  ISSUES = "issues",
  PULL_REQUESTS = "pullRequests",
  ORGS_USERS = "orgsUsers",
}

export interface FILTER_INTERFACE {
  event?: any;
  userId?: string;
  $text?: { $search: string };

}



export interface GitHubCommitsDocument extends Document {
  sha: string;
  node_id: string;
  commit: {},
  url: string,
  html_url: string,
  comments_url: string,
  author: {},
  committer: {},
  parents: [],
  fetchedAt: Date;
  userId: string;
  repoId: string;
}

interface GitHubApp {
  id: number;
  slug: string;
  node_id: string;
  client_id: string;
  owner: User | Enterprise;
  name: string;
  description: string | null;
  external_url: string;
  html_url: string;
  created_at: string;
  updated_at: string;
  permissions: {
    issues: string;
    checks: string;
    metadata: string;
    contents: string;
    deployments: string;
  };
  events: string[];
  installations_count: number;
  client_secret: string;
  webhook_secret: string | null;
  pem: string;
}

interface Enterprise {
  description: string | null;
  html_url: string;
  website_url: string | null;
  id: number;
  node_id: string;
  name: string;
  slug: string;
  created_at: string | null;
  updated_at: string | null;
  avatar_url: string;
}

export interface GithubIssueTimelineDocument extends Document {
  id: number;
  node_id: string;
  url: string;
  actor: User;
  event: string;
  commit_id: string | null;
  commit_url: string | null;
  created_at: string;
  performed_via_github_app: GitHubApp | null;
  label?: {
    name: string;
    color: string;
  };
  milestone?: {
    title: string;
  };
  rename?: {
    from: string;
    to: string;
  };
  review_requester?: User;
  requested_team?: {
    id: number;
    node_id: string;
    name: string;
    slug: string;
    description: string | null;
    privacy: string;
    notification_setting: string;
    permission: string;
    permissions: {
      pull: boolean;
      triage: boolean;
      push: boolean;
      maintain: boolean;
      admin: boolean;
    };
    url: string;
    html_url: string;
    members_url: string;
    repositories_url: string;
    parent: null | {
      id: number;
      node_id: string;
      url: string;
      members_url: string;
      name: string;
      description: string | null;
      permission: string;
      privacy: string;
      notification_setting: string;
      html_url: string;
      repositories_url: string;
      slug: string;
      ldap_dn: string;
    };
  };
  requested_reviewer?: User;
  dismissed_review?: {
    state: string;
    review_id: number;
    dismissal_message: string | null;
    dismissal_commit_id: string;
  };
  lock_reason?: string | null;
  project_card?: {
    id: number;
    url: string;
    project_id: number;
    project_url: string;
    column_name: string;
    previous_column_name?: string;
  };
  userId: string;
  repoId: string;
  fetchedAt: Date;
  issueId: string;
}


export interface GitHubIssuesDocument extends Document {
  url: string,
  repository_url: string,
  labels_url: string,
  comments_url: string,
  events_url: string,
  html_url: string,
  id: number,
  node_id: string,
  number: number,
  title: string,
  user: User,
  labels: [],
  state: string,
  locked: boolean,
  assignee: {},
  assignees: [],
  milestone: {},
  comments: number,
  created_at: string,
  updated_at: string,
  closed_at: string,
  author_association: string,
  active_lock_reason: any,
  body: string,
  closed_by: any,
  reactions: {
    url: string,
    total_count: number,
    '+1': number,
    '-1': number,
    laugh: number,
    hooray: number,
    confused: number,
    heart: number,
    rocket: number,
    eyes: number
  },
  timeline_url: string,
  performed_via_github_app: any,
  state_reason: any
  fetchedAt: Date;
  userId: string;
  repoId: string;

}

export interface GitHubOrganizationsDocument extends Document {
  avatar_url: string;
  description: string;
  events_url: string;
  hooks_url: string;
  id: number;
  issues_url: string;
  login: string;
  members_url: string;
  node_id: string;
  public_members_url: string;
  repos_url: string;
  url: string;
  fetchedAt: Date;
  userId: string;
}


export interface GithubOrganizationsUsersDocument extends Document {
  login: string,
  id: string,
  node_id: string,
  avatar_url: string,
  gravatar_id: string,
  url: string,
  html_url: string,
  followers_url: string,
  following_url: string,
  gists_url: string,
  starred_url: string,
  subscriptions_url: string,
  organizations_url: string,
  repos_url: string,
  events_url: string,
  received_events_url: string,
  type: string,
  site_admin: boolean;
  fetchedAt: Date;
  userId: string;
  orgId: string;
}

interface User {
  name: string | null;
  email: string | null;
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  starred_at: string;
  user_view_type: string;
}

interface Repo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  license: {
    key: string;
    name: string;
    url: string | null;
    spdx_id: string | null;
    node_id: string;
    html_url: string;
  } | null;
  forks: number;
  permissions: {
    admin: boolean;
    pull: boolean;
    triage: boolean;
    push: boolean;
    maintain: boolean;
  };
  owner: User;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  url: string;
  archive_url: string;
  assignees_url: string;
  blobs_url: string;
  branches_url: string;
  collaborators_url: string;
  comments_url: string;
  commits_url: string;
  compare_url: string;
  contents_url: string;
  contributors_url: string;
  deployments_url: string;
  downloads_url: string;
  events_url: string;
  forks_url: string;
  git_commits_url: string;
  git_refs_url: string;
  git_tags_url: string;
  git_url: string;
  issue_comment_url: string;
  issue_events_url: string;
  issues_url: string;
  keys_url: string;
  labels_url: string;
  languages_url: string;
  merges_url: string;
  milestones_url: string;
  notifications_url: string;
  pulls_url: string;
  releases_url: string;
  ssh_url: string;
  stargazers_url: string;
  statuses_url: string;
  subscribers_url: string;
  subscription_url: string;
  tags_url: string;
  teams_url: string;
  trees_url: string;
  clone_url: string;
  mirror_url: string | null;
  hooks_url: string;
  svn_url: string;
  homepage: string | null;
  language: string | null;
  forks_count: number;
  stargazers_count: number;
  watchers_count: number;
  size: number;
  default_branch: string;
  open_issues_count: number;
  is_template: boolean;
}

interface Links {
  comments: { href: string };
  commits: { href: string };
  statuses: { href: string };
  html: { href: string };
  issue: { href: string };
  review_comments: { href: string };
  review_comment: { href: string };
  self: { href: string };
}

export interface GitHubPullsDocument extends Document {
  url: string;
  id: number;
  node_id: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
  issue_url: string;
  number: number;
  state: string;
  locked: boolean;
  title: string;
  user: User;
  body: string | null;
  created_at: Date;
  updated_at: Date;
  closed_at: Date | null;
  merged_at: Date | null;
  merge_commit_sha: string | null;
  assignee: User | null;
  assignees: User[];
  requested_reviewers: User[];
  requested_teams: {
    id: number;
    node_id: string;
    name: string;
    slug: string;
    description: string | null;
    privacy: string;
    notification_setting: string;
    permission: string;
    permissions: {
      pull: boolean;
      triage: boolean;
      push: boolean;
      maintain: boolean;
      admin: boolean;
    };
    url: string;
    html_url: string;
    members_url: string;
    repositories_url: string;
    parent: {
      id: number;
      node_id: string;
      url: string;
      members_url: string;
      name: string;
      description: string | null;
      permission: string;
      html_url: string;
      repositories_url: string;
      slug: string;
    } | null;
  }[];
  labels: {
    id: number;
    node_id: string;
    url: string;
    name: string;
    description: string;
    color: string;
    default: boolean;
  }[];
  milestone: {
    url: string;
    html_url: string;
    labels_url: string;
    id: number;
    node_id: string;
    number: number;
    state: string;
    title: string;
    description: string;
    creator: User;
    open_issues: number;
    closed_issues: number;
    created_at: Date;
    updated_at: Date;
    closed_at: Date | null;
    due_on: Date | null;
  } | null;
  active_lock_reason: string | null;
  head: {
    label: string;
    ref: string;
    repo: Repo;
    sha: string;
    user: User;
  };
  base: {
    label: string;
    ref: string;
    repo: Repo;
    sha: string;
    user: User;
  };
  _links: Links;
  author_association: string;
  auto_merge: {
    enabled_by: User;
    merge_method: string;
    commit_title: string;
    commit_message: string;
  } | null;
  draft: boolean;
  fetchedAt: Date;
  userId: string;
  repoId: string;
}


export interface GitHubReposDocument extends Document {
  id: number,
  node_id: string,
  name: string,
  full_name: string,
  private: boolean,
  owner: {
    login: string,
    id: number,
    node_id: string,
    avatar_url: string,
    gravatar_id: string,
    url: string,
    html_url: string,
    followers_url: string,
    following_url: string,
    gists_url: string,
    starred_url: string,
    subscriptions_url: string,
    organizations_url: string,
    repos_url: string,
    events_url: string,
    received_events_url: string,
    type: string,
    user_view_type: string,
    site_admin: boolean
  },
  html_url: string,
  description: string,
  fork: boolean,
  url: string,
  forks_url: string,
  keys_url: string,
  collaborators_url: string,
  teams_url: string,
  hooks_url: string,
  issue_events_url: string,
  events_url: string,
  assignees_url: string,
  branches_url: string,
  tags_url: string,
  blobs_url: string,
  git_tags_url: string,
  git_refs_url: string,
  trees_url: string,
  statuses_url: string,
  languages_url: string,
  stargazers_url: string,
  contributors_url: string,
  subscribers_url: string,
  subscription_url: string,
  commits_url: string,
  git_commits_url: string,
  comments_url: string,
  issue_comment_url: string,
  contents_url: string,
  compare_url: string,
  merges_url: string,
  archive_url: string,
  downloads_url: string,
  issues_url: string,
  pulls_url: string,
  milestones_url: string,
  notifications_url: string,
  labels_url: string,
  releases_url: string,
  deployments_url: string,
  created_at: string,
  updated_at: string,
  pushed_at: string,
  git_url: string,
  ssh_url: string,
  clone_url: string,
  svn_url: string,
  homepage: string,
  size: number,
  stargazers_count: number,
  watchers_count: number,
  has_issues: boolean,
  has_projects: boolean,
  has_downloads: boolean,
  has_wiki: boolean,
  has_pages: boolean,
  has_discussions: boolean,
  forks_count: number,
  mirror_url: string,
  archived: boolean,
  disabled: boolean,
  open_issues_count: string,
  license: {},
  allow_forking: boolean,
  is_template: boolean,
  web_commit_signoff_required: boolean,
  topics: [],
  visibility: string,
  forks: number,
  open_issues: number,
  watchers: number,
  default_branch: string,
  permissions: {
    admin: boolean,
    maintain: boolean,
    push: boolean,
    triage: boolean,
    pull: boolean,
  }
  fetchedAt: Date;
  userId: string;
  orgId: string;
}


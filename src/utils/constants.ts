import { GITHUB_ENDPOINTS_INTERFACE } from "../interfaces/github";

export const GITHUB_API_URL = "https://api.github.com";

export const GITHUB_ENDPOINTS: GITHUB_ENDPOINTS_INTERFACE = {
  orgs: (_org: string, _repo?: string, _issueNumber?: string, perPage?: number, page?: number) => `${GITHUB_API_URL}/user/orgs?per_page=${perPage}&page=${page}`,
  repos: (org: string, _repo?: string, _issueNumber?: string, perPage?: number, page?: number) => `${GITHUB_API_URL}/orgs/${org}/repos?per_page=${perPage}&page=${page}`,
  commits: (org: string, repo: string, _issueNumber?: string, perPage?: number, page?: number) => `${GITHUB_API_URL}/repos/${org}/${repo}/commits?per_page=${perPage}&page=${page}`,
  issues: (org: string, repo: string, _issueNumber?: string, perPage?: number, page?: number) => `${GITHUB_API_URL}/repos/${org}/${repo}/issues?per_page=${perPage}&page=${page}&state=all`,
  pullRequests: (org: string, repo: string, _issueNumber: string, perPage?: number, page?: number) => `${GITHUB_API_URL}/repos/${org}/${repo}/pulls?per_page=${perPage}&page=${page}`,
  orgsUsers: (org: string, _repo: string, _issueNumber: string, perPage?: number, page?: number) => `${GITHUB_API_URL}/orgs/${org}/members?per_page=${perPage}&page=${page}`,
};


export const airtableEndpoints = {
  BASES: "/meta/bases",
  TABLES: "/meta/bases/{baseId}/tables",
  TABLE: "/{baseId}/{tableId}",
  USERS: "/Users",
  REVOKE: "/revoke",
}

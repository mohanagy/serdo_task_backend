import { GITHUB_ENDPOINTS_INTERFACE } from "../interfaces/github";
import { GITHUB_ENDPOINTS } from "../utils/constants";
import axios from "axios";

export const fetchGithubData = async (
  type: keyof GITHUB_ENDPOINTS_INTERFACE,
  org: string,
  repo: string = "",
  issueNumber: string = "",
  accessToken?: string,
  page: number = 1,
) => {
  try {
    const generateEndpointUrl = GITHUB_ENDPOINTS[type];
    const url = generateEndpointUrl(org, repo, issueNumber, 100, page);
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "-GitHub-Api-Version": "2022-11-28",
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

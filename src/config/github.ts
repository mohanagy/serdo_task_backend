import Joi from "joi";
import { GithubConfig } from "../interfaces/GithubConfig";

const envVarsSchema = Joi.object({
  GITHUB_CLIENT_ID: Joi.string().required(),
  GITHUB_CLIENT_SECRET: Joi.string().required(),
}).unknown(true);

const githubConfig = (): GithubConfig => {
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return {
    clientId: envVars.GITHUB_CLIENT_ID,
    clientSecret: envVars.GITHUB_CLIENT_SECRET,
  };
};

export default githubConfig;

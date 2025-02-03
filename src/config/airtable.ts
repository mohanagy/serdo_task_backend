import Joi from "joi";
import { AirtableConfig } from "../interfaces/AirtableConfig";

const envVarsSchema = Joi.object({
  AIRTABLE_API_KEY: Joi.string().required(),
  AIRTABLE_BASE_URL: Joi.string().required(),
  AIRTABLE_CLIENT_ID: Joi.string().required(),
  AIRTABLE_CLIENT_SECRET: Joi.string().required(),
  AIRTABLE_REDIRECT_URI: Joi.string().required(),
  AIRTABLE_SCOPE: Joi.string().required(),
}).unknown(true);

const airtableConfig = (): AirtableConfig => {
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return {
    apiKey: envVars.AIRTABLE_API_KEY,
    baseUrl: envVars.AIRTABLE_BASE_URL,
    clientId: envVars.AIRTABLE_CLIENT_ID,
    clientSecret: envVars.AIRTABLE_CLIENT_SECRET,
    redirectUri: envVars.AIRTABLE_REDIRECT_URI,
    scope: envVars.AIRTABLE_SCOPE,

  };
};

export default airtableConfig;

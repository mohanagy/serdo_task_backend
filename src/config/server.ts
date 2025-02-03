import Joi from "joi";
import { ServerConfig } from "../interfaces/ServerConfig";

const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  SESSION_SECRET: Joi.string().required(),
  PUBLIC_URL: Joi.string().required(),
}).unknown(true);

const serverConfig = (): ServerConfig => {
  const { value: envVars, error } = envVarsSchema.validate(process.env);
  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return {
    port: envVars.PORT,
    databaseUrl: envVars.DATABASE_URL,
    sessionSecret: envVars.SESSION_SECRET,
    publicUrl: envVars.PUBLIC_URL,
  };
};

export default serverConfig;

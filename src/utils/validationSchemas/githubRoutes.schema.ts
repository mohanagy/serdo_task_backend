import Joi from "joi";

export const fetchSchema = Joi.object({
  type: Joi.string().valid("organizations", "repos", "commits").required(),
  org: Joi.string().required(),
  repo: Joi.string().optional(),
});

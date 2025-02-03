import dotenv from "dotenv";
import path from "path";
import github from "./github";
import airtable from "./airtable";
import server from "./server";

if (!process.env.NODE_ENV) {
  throw new Error("NODE_ENV is not defined");
}
dotenv.config({
  path: path.join(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

export default {
  github: github(),
  airtable: airtable(),
  server: server(),
};

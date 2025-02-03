import express from "express";
import config from "./config";
import { initDatabase } from "./config/database";
import passport from "./config/passport";
import session from "express-session";
import { authRoutes } from "./routes/authRoutes";
import { githubRoutes } from "./routes/githubRoutes";
import cors from "cors";
import cookieParser from 'cookie-parser';
import { airtableRoutes } from './routes/airtableRoutes';

const app = express();
app.use(
  cors({
    origin: "http://localhost:4200",
    credentials: true,
  }),
);
app.use(cookieParser());

const PORT = config.server.port;
declare global {
  namespace Express {
    interface User {
      _id: string;
      id: string;
      userId: string;
      accessToken: string;
    }
    interface Request {
      user?: User;
    }
  }
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: config.server.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
void initDatabase(config.server.databaseUrl);

app.use("/api", [authRoutes, githubRoutes, airtableRoutes]);

// Error Handling Middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

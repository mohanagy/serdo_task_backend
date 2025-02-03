import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { GithubIntegration } from "../models/GithubIntegration";
import config from "./";
import { GitHubProfile } from "../interfaces/github";

passport.use(
  new GitHubStrategy(
    {
      clientID: config.github.clientId,
      clientSecret: config.github.clientSecret,
      callbackURL: "http://localhost:3000/api/auth/github/callback",
    },
    async (
      accessToken: string,
      _refreshToken: string,
      profile: GitHubProfile,
      done: (error: any, user?: any) => void,
    ) => {
      try {
        await GithubIntegration.findOneAndUpdate(
          { userId: profile.id, },
          {
            userId: profile.id,
            ...profile,
            accessToken,
            connectedAt: new Date(),
          },
          { upsert: true, new: true },
        );
        return done(null, { accessToken, ...profile });
      } catch (error) {
        return done(error);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user: any = await GithubIntegration.findOne({ userId: id });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
export default passport;


import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve('config/.env') });
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, GoogleCallbackParameters  } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import userModel,{IUser} from '../db/models/usermodel';
 import express, { Request } from "express";


interface GoogleUser  {
  user: IUser;
  token: string;
}

        
 passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID as string,
      clientSecret: process.env.CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_REDIRECT_URI as string,
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      params: GoogleCallbackParameters, 
      profile: Profile,
      done: (error: any, user?: any) => void
    ) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(new Error('Email not found'), false);
        }

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            picture: profile.photos?.[0].value,
            confirmed: true,
            loggedIn: true,
            role: 'user',
          });
        }
        const secret = process.env.JWT_KEY;
if (!secret) {
  console.error(" JWT_KEY is not defined in environment variables");
  throw new Error("Missing JWT_KEY");
}
        const token = jwt.sign(
          { id: user._id, role: user.role },secret);

        return done(null, { user, token });
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user);
});

passport.deserializeUser((user: any, done) => {
  done(null, user);
});

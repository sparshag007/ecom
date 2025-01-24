import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from "../database/models/User";
import { RequestUser } from "../types/requestuser";
import bcrypt from 'bcrypt';

passport.use('google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if the user already exists by email (Google login should be linked to the email)
        let userRecord = await User.findOne({ where: { email: profile.emails?.[0].value } });
        let user: RequestUser;
        
        if (userRecord) {
          user = {
            id: userRecord.id,
            googleId: '',
            displayName: userRecord.username,
            email: userRecord.email,
            role: userRecord.role,
            avatar: profile.photos?.[0].value,
          };
          if (userRecord.googleId) {
            user.googleId =  userRecord.googleId;            
          } else {
            // If the user exists but hasn't logged in via Google, update their googleId
            userRecord.googleId = profile.id; // Update googleId in the database
            user.googleId = profile.id;
            await userRecord.save(); // Save the updated user record
          }
        } else {
          // If no user exists, create a new user with googleId
          const userRecord = await User.create({
            googleId: profile.id,
            email: profile.emails?.[0].value,
            username: profile.displayName,
            password: null, // Google login doesn't require a password
            role: 'user',  // You can adjust based on your role logic
          });
          user = {
            id: userRecord.id,
            googleId: userRecord.googleId || profile.id,
            displayName: userRecord.username,
            email: userRecord.email,
            role: userRecord.role,
            avatar: profile.photos?.[0].value,
          }
        }
        return done(null, user);
      } catch (error) {
        return done(error, {});
      }
    }
  )
);


passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email' }, // The email field is used as the username
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        if (user.password === null) {
          return done(null, false, { message: 'This account was created via Google login, use Google authentication.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }
        const requestUser: RequestUser =  {
          id: user.id,
          googleId: user.googleId || '',
          displayName: user.username,
          email: user.email,
          role: user.role,
          avatar: ''
        }
        return done(null, requestUser);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user: any, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

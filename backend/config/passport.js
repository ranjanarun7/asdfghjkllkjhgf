
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/userModel');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Helper function to handle social login
const socialLoginCallback = async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user exists by social ID
        let user = await User.findOne({
            $or: [
                { googleId: profile.id },
                { facebookId: profile.id },
                { twitterId: profile.id }
            ]
        });

        if (user) {
            return done(null, user);
        }

        // Check if user exists by email (to merge accounts)
        // Note: Twitter might not provide email depending on permissions/settings
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

        if (email) {
            user = await User.findOne({ email });
            if (user) {
                // Link social ID to existing account
                if (profile.provider === 'google') user.googleId = profile.id;
                if (profile.provider === 'facebook') user.facebookId = profile.id;
                if (profile.provider === 'twitter') user.twitterId = profile.id;
                await user.save();
                return done(null, user);
            }
        }

        // Create new user
        const newUser = new User({
            name: profile.displayName,
            email: email || `${profile.id}@${profile.provider}.com`, // Fallback email if not provided
            password: `socialLogin_${profile.id}_${Date.now()}`, // Dummy password
            avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
            googleId: profile.provider === 'google' ? profile.id : undefined,
            facebookId: profile.provider === 'facebook' ? profile.id : undefined,
            twitterId: profile.provider === 'twitter' ? profile.id : undefined,
        });

        await newUser.save();
        done(null, newUser);

    } catch (err) {
        done(err, null);
    }
};

// Debug logs
console.log("--- Google Auth Debug ---");
console.log("Client ID:", process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 15) + "..." : "Missing");
console.log("Client Secret:", process.env.GOOGLE_CLIENT_SECRET ? "Loaded (Starts with " + process.env.GOOGLE_CLIENT_SECRET.substring(0, 5) + ")" : "Missing");
console.log("Callback URL:", "http://localhost:5000/auth/google/callback");
console.log("-------------------------");

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/auth/google/callback"
},
    socialLoginCallback
));

/* 
// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  socialLoginCallback
));

// Twitter Strategy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "/auth/twitter/callback",
    includeEmail: true
  },
  socialLoginCallback
)); 
*/

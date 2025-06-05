// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/userSchema');

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "/auth/google/callback",
//     scope: ['profile', 'email']
//   },
//  function(accessToken, refreshToken, profile, done) {
//   console.log('GoogleStrategy', profile)
//     try {
//       // Check if user already exists in database
//       let user = User.findOne({ userID: profile.id });
//       console.log('Mid-Google Strategy')
//       if (user) {
//         // User exists, return user
//         return done(null, user);
//       } else {
//         // Create new user
//         user = User.create({
//           googleId: profile.id,
//           name: profile.displayName,
//           email: profile.emails[0].value,
//           avatar: profile.photos[0].value
//         });
//         console.log('User')
//         return done(null, user);
//         // console.log(profile)
//       }
//     } catch (error) {
//       return done(error, null);
//     }
//     console.log('End of Google Strategy')
//   }
// ));

// // To match the user with sessions
// passport.serializeUser((userId, done) => {
//   done(null, userId);
// });

// // Retrieve user data from session
// passport.deserializeUser(async (user, done) => {
//   try { 
//     const user = await User.findById(id);
//     done(null, error);
//   } catch (error) {
//     done(error,null)
//   }
//   });


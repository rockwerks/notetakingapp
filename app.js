const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Note = require('./models/noteSchema');
const User = require('./models/userSchema');
// const { MongoClient } = require('mongodb');
const passport = require("passport");
const path = require("path");
const { isLoggedIn } = require("./middleware/auth");
require("dotenv").config();
require("./config/passport");

async function main() {
  const app = express();
  const client = await mongoose
    .connect(
      "mongodb+srv://Rockwerks:dncC73AEAA4mvtO0@rockwerkscluster01.04nzply.mongodb.net/my-notes-app?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then((client) => {
      console.log("Connected to MongoDB");
      return client;
    })
    .catch((err) => console.error("Connection error:", err));

  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your_session_secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.set("view engine", "ejs");
  // if you delete this line, it will default to 'views' folder
  app.set("views", path.join(__dirname, "views"));

  app.use(express.static(path.join(__dirname, "public")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ userID: profile.id });

          if (user) {
            // User exists, return user
            return done(null, user);
          } else {
            // Create new user
            user = new User({
              userID: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
            });

            await user.save();
            return done(null, user);
          }
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Routes
  app.use("/", require("./routes/auth"));
  app.use("/notes", require("./routes/notes"));

  app.get("/", (req, res) => {
    res.render("login", { user: req.user });
  });

  app.get("/dashboard", isLoggedIn, (req, res) => {
    res.render("dashboard", { user: req.user });
  });
  app.get("/index", isLoggedIn, (req, res) => {
    res.render("index", { user: req.user });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to see the app`);
  });
}
main();

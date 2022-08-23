const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
app.use(bodyParser.json());
const mongoose = require("mongoose");

const URL = process.env.URL;
mongoose.connect(
  URL,
  {
    useNewUrlParser: true,
  },
  (err, data) => {
    if (!err) {
      console.log("Database Successfully connected");
    } else {
      console.log(err);
    }
  }
);
const cors = require("cors");
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

const route = require("./src/routes/routes");

//Routing
app.use("/api", route);

///login with google
const session = require("express-session");
const passport = require("passport");
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);
app.use(passport.initialize());
app.use(passport.session());
///

///google
const user = require("./src/models/auth");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:6000/api/auth/google/callback",
      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      user.findOne({ googleId: profile?.id }).then((existingUser) => {
        if (existingUser) {
          return done(null, existingUser);
        } else {
          var result = "";
          var characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          var charactersLength = characters.length;
          for (var i = 0; i < 5; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }
          new user({
            googleId: profile.id,
            first_name: profile._json.given_name,
            last_name: profile._json.family_name,
            is_email_verify: true,
            email: profile.emails[0].value,
            provider: "google",
            referal_code: result,
          })
            .save()
            .then((user) => done(null, user));
        }
      });
    }
  )
);
///

app.set("view engine", "ejs");
app.get("/success", (req, res) => res.send("You are a valid user"));
app.get("/error", (req, res) => res.send("error logging in"))
app.use("/uploads", express.static("uploads"));

const url = 8080;
app.listen(url, () => {
  console.log("Server is Running on port " + url);
});

const express = require("express");
const Router = express.Router();
const auth = require("../../controller/auth.js");
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const { verifytoken } = require("../../middleware/auth.js");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/users/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    
    if (file.mimetype == "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
      // return cb(new Error('Only .pdf format allowed!'));
    }
  },
});
const router = () => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
    // user.findById(obj, (err,user)=>{
    // })
  });
  Router.post("/login", auth.login);

  Router.post("/register", auth.register);
  Router.post("/", upload.single("file"), auth.fileupload);

  Router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
  );

  Router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/error",
      successRedirect: "/success",
      session: false,
    })
  );
  Router.get("/success", (req, res) => {
    res.send("Valid User");
  });
  Router.get("/error", (req, res) => {
    res.send("Invalid User");
  });
  Router.patch("/updateprofile",verifytoken,auth.updateprofile)
  Router.patch("/password",verifytoken,auth.updatepassword)

  Router.get("/users", auth.getusers);
  Router.post("/sendinvites", auth.sendinvites);

  return Router;
};
module.exports = router();

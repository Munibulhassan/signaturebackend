const express = require("express")
const Router = express.Router()
const auth = require("../../controller/auth.js")
const passport = require("passport");

const router =()=>{
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
  
  Router.get(
    "/google",
    passport.authenticate("google", { scope: [ "email","profile"] })
  );

  Router.get(
    "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/error",
      successRedirect: "/success",
      session:false
    })    
  );
  Router.get("/success",(req,res)=>{
    res.send("Valid User")
  })
  Router.get("/error",(req,res)=>{
    res.send("Invalid User")
  })
    return Router
}
module.exports = router();

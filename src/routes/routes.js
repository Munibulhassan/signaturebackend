const express = require("express");
const app = express();
const auth = require("./auth/auth");
const signature = require("./signature/signature");

app.use("/auth",auth)
app.use("/signature",signature)


module.exports = app;

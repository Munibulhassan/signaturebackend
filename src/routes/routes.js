const express = require("express");
const folder = require("./folder/folder");
const app = express();
const auth = require("./auth/auth");
const documents = require("./documents/document");
const signature = require("./signature/signature");
const subscription = require("./subscription/subscription");
const team = require("./team/team");

app.use("/auth", auth);
app.use("/signature", signature);
app.use("/subscription", subscription);
app.use("/team", team);
app.use("/document", documents);
app.use("/folder", folder);

module.exports = app;

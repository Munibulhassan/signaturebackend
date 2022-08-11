const express = require("express");
const Router = express.Router();
const { verifytoken } = require("../../middleware/auth.js");
const folder = require("../../controller/folder.js");

const router = () => {
    Router.post("/",verifytoken,folder.createfolder)
    Router.get("/",verifytoken,folder.getfolder)
    Router.patch("/:id",verifytoken,folder.updatefolder)
    Router.delete("/:id",verifytoken,folder.deletefolder)

  return Router;
};
module.exports = router();

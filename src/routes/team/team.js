const express = require("express");
const Router = express.Router();
const { verifytoken } = require("../../middleware/auth.js");
const team = require("../../controller/team.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/team/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

var upload = multer({ storage: storage });

const router = () => {
  Router.post("/",verifytoken,upload.array("file"),team.createteam)
  Router.get("/",verifytoken,team.getteam)
  Router.patch("/:id",verifytoken,upload.array("file"),team.updateteam)
  Router.delete("/:id",verifytoken,team.deleteteam)
  
  return Router;
};
module.exports = router();

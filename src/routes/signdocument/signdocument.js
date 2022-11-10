const express = require("express");
const Router = express.Router();
const signaturedoc = require("../../controller/signaturedoc.js");

const multer = require("multer");
const path = require("path");
const { verifytoken } = require("../../middleware/auth.js");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/signdoc/");
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
    
    if (file.mimetype == "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
      // return cb(new Error('Only .pdf format allowed!'));
    }
  },
});

const router = () => {
  Router.post("/", signaturedoc.createsignature);
  Router.post("/", verifytoken, upload.array("file"), signaturedoc.fileupload);
  Router.get("/", signaturedoc.getsignature);
  Router.patch("/:id", verifytoken, signaturedoc.updatesignature);
  Router.delete("/:id", verifytoken, signaturedoc.deletesignature);
  return Router;
};
module.exports = router();
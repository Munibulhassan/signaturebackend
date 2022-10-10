const express = require("express");
const Router = express.Router();
const signature = require("../../controller/signature.js");

const multer = require("multer");
const path = require("path");
const { verifytoken } = require("../../middleware/auth.js");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/signature/");
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
  Router.post("/:type", verifytoken, signature.createsignature);
  Router.post("/", verifytoken, upload.array("file"), signature.fileupload);
  Router.get("/", verifytoken, signature.getsignature);
  Router.patch("/:id", verifytoken, signature.updatesignature);
  Router.delete("/:id", verifytoken, signature.deletesignature);
  return Router;
};
module.exports = router();

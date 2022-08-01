const express = require("express")
const Router = express.Router()
const signature = require("../../controller/signature.js")
const multer = require("multer");
const path = require("path");
const {  verifytoken } = require("../../middleware/auth.js");
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

var upload = multer({ storage: storage });
const router =()=>{
Router.post("/:status",verifytoken,upload.array("file"),signature.signme)
return Router

}
module.exports = router();

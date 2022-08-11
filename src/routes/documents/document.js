const express = require("express");
const Router = express.Router();
const { verifytoken } = require("../../middleware/auth.js");
const documents = require("../../controller/documents.js");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads/documents/");
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
    Router.post("/",verifytoken,upload.single("file"),documents.createdocuments)
    Router.get("/",verifytoken,documents.getdocuments)
    Router.patch("/:id",verifytoken,documents.updatedocuments)
    Router.delete("/:id",verifytoken,documents.deletedocuments)

  return Router;
};
module.exports = router();

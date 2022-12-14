const folder = require("../models/folder");
exports.createfolder = async (req, res) => {
  try {
    req.body.createdby = req.user._id;
    if (!req.body.name) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      if (req.body.document) {
        req.body.document = JSON.parse(req.body.document);
      }
      folder.findOne(
        { name: req.body.name, createdby: req.user._id },
        (err, result) => {
          if (result) {
            res.status(200).send({
              success: false,
              message: "folder with same name exist use another name",
            });
          } else {
            const Folder = new folder(req.body);
            Folder.save().then((item) => {
              res.status(200).send({
                success: true,
                message: "folder successfully save",
                data: item,
              });
            });
          }
        }
      );
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.getfolder = async (req, res) => {
  try {
    Object.assign(req.query, { createdby: req.user._id });
    const data = await folder.find(req.query).populate("document").exec();

    if (data.length == 0) {
      res
        .status(200)
        .send({ message: "There is no any folder available", success: false });
    } else {
      res.status(200).send({
        message: "All folder fetch ",
        success: true,
        data: data,
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

exports.updatefolder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      folder.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (result.createdby == req.user._id) {
            if (req.body.status) {
              req.body.status = req.body.status.toUpperCase();
            }
            folder.updateOne({ _id: id }, req.body, (err, result) => {
              if (err) {
                res.status(200).send({ message: err.message, success: false });
              } else {
                res.status(200).send({
                  message: "Data updated Successfully",
                  success: true,
                  data: result,
                });
              }
            });
          } else {
            res.status(200).send({
              message: "You have no permission for delete this document",
              success: false,
            });
          }
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deletefolder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      folder.findOne({ _id: id }, async (err, result) => {
        if (result) {
          if (result.createdby == req.user._id) {
            folder.deleteOne({ _id: id }, (err, val) => {
              if (!val) {
                res.status(200).send({ message: err.message, success: false });
              } else {
                res.status(200).send({
                  message: "Data deleted Successfully",
                  success: true,
                });
              }
            });
          } else {
            res.status(200).send({
              message: "You have no permission for delete this document",
              success: false,
            });
          }
        } else {
          res.status(200).send({ message: "Data Not exist", success: false });
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.adddocinfolder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      folder.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          result.document.push(req.body.document);

          folder.updateOne({ _id: id }, result, (err, result) => {
            if (err) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "Data updated Successfully",
                success: true,
                data: result,
              });
            }
          });
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

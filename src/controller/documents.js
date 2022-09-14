const documents = require("../models/document");

exports.createdocuments = async (req, res) => {
  try {
    req.body.createdby = req.user._id;
    req.body.document = req.file.filename;
    

    if (req.body.signedby) {
      req.body.signedby = JSON.parse(req.body.signedby);
    }
    if (req.body.viwedby) {
      req.body.viwedby = JSON.parse(req.body.viwedby);
    }
    const Documents = new documents(req.body);
    Documents.save().then((item) => {
      res.status(200).send({
        success: false,
        message: "Documents successfully save",
        data: item,
      });
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
exports.getdocuments = async (req, res) => {
  try {

    Object.assign(req.query, { createdby: req.user._id });
    const data = await documents.find(req.query).exec();
    if (data.length == 0) {
      res
        .status(200)
        .send({ message: "There is no any plan available", success: false });
    } else {
      var filterdata = [];
      if (req.body.signer) {
        data.map((item) => {
          for (var i = 0; i < item?.signedby.length; i++) {
            if (item.signedby[i].email == req.body.signer) {
              filterdata.push(item);
              break;
            }
          }
        });
      } else {
        filterdata = data;
      }
      res.status(200).send({
        message: "All documents fetch ",
        success: true,
        data: filterdata,
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
exports.updatedocuments = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      documents.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (result.createdby == req.user._id) {
            if (req.body.status) {
              req.body.status = req.body.status.toUpperCase();
            }
            documents.updateOne({ _id: id }, req.body, (err, result) => {
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
exports.deletedocuments = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      documents.findOne({ _id: id }, async (err, result) => {
        if (result) {
          if (result.createdby == req.user._id) {
            documents.deleteOne({ _id: id }, (err, val) => {
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
          res.status(200).send({ message: "Order Not exist", success: false });
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

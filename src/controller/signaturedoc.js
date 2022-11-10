const pd_api = require("pandadoc-node-client");

const axios = require("axios");
const authentication = require("../models/auth");
const signaturedoc = require("../models/signaturedoc");

const API_KEY = process.env.API_KEY;
const configuration = pd_api.createConfiguration({
  authMethods: { apiKey: `API-Key ${API_KEY}` },
});

// apiInstance
//   .listTemplates({ deleted: false, tag: ["doe-inc-proposals"] })
//   .then((data) => {
//     console.log("API called successfully. Returned data: %o", data);
//   })
//   .catch((error) => console.error(error));

exports.createsignature = async (req, res) => {
  try {
    req.body.type = req.params.type.toLowerCase();
    req.body.owner = req.user._id;
    const { title } = req.body;
    if (!title) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const user = await authentication.findOne({ _id: req.user._id });

      if (user.sign <= 0) {
        res.status(200).send({
          message: "You Sign limit is exceed upgrade to use more sign",
          success: false,
        });
      } else {
        await authentication.updateOne(
          { _id: req.user._id },
          { $inc: { sign: -1, "metrics.orders": 1 } }
        );
        if (req.body.signer) {
          req.body.signer = JSON.parse(req.body.signer);
        }
        if (req.body.viewer) {
          req.body.viewer = JSON.parse(req.body.Viewer);
        }
        req.files.map((item, index) => {
          const arr = [];
          arr.push(item.filename);
          if (index == req.files.length - 1) {
            req.body.file = arr;
          }
        });

        const Signature = new signaturedoc(req.body);
        Signature.save().then((item) => {
          res.status(200).send({
            message: "Data save into Database",
            data: item,
            success: true,
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.fileupload = async (req, res) => {
  try {
    req.files.map((item, index) => {
      const arr = [];
      arr.push(item.filename);
      if (index == req.files.length - 1) {
        res.send(arr);
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.getsignature = async (req, res) => {
  try {
    req.query = Object.fromEntries(
      Object.entries(req.query).filter(
        ([_, v]) => v != "" && v != " " && v != "null"
      )
    );

    const { title, ...query } = req.query;

    if (Object.keys(query).length > 0) {
      let data = await signaturedoc.find(query).populate("owner").exec();

      if (data.length == 0) {
        res.status(200).send({
          message: "There is no any signature available",
          success: false,
        });
      } else {
        if (title?.length > 0) {
          data = data.filter((item) => {
            return item.title.search(title) != -1;
          });
        }

        res.status(200).send({
          message: "All Signature fetch",
          success: true,
          data: data,
        });
      }
    } else {
      let data = await signaturedoc.find({}).populate("owner").exec();

      if (data.length == 0) {
        res.status(200).send({
          message: "There is no any signature available",
          success: false,
        });
      } else {
        if (title?.length > 0) {
          data = data.filter((item) => {
            return item.title.search(title) != -1;
          });
        }
        res.status(200).send({
          message: "All Signature fetch",
          success: true,
          data: data,
        });
      }
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
exports.updatesignature = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      signaturedoc.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (result.owner == req.user._id) {
            signaturedoc.updateOne({ _id: id }, req.body, (err, result) => {
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
              message: "You have no permission for update the Signature",
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
exports.deletesignature = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      signaturedoc.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (result.owner == req.user._id) {
            signaturedoc.deleteOne({ _id: id }, (err, result) => {
              if (err) {
                res.status(200).send({ message: err.message, success: false });
              } else {
                res.status(200).send({
                  message: "Signature Deleted Successfully",
                  success: true,
                  data: result,
                });
              }
            });
          } else {
            res.status(200).send({
              message: "You have no permission for Delete the Signature",
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

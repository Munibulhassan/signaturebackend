const team = require("../models/team");
const fs = require("fs");
const { promisify } = require("util");

const unlinkAsync = promisify(fs.unlink);

exports.createteam = async (req, res) => {
  try {
    

    req.body.owner = req.user._id;
    const { owner, member } = req.body;
    req.body.viewer = JSON.parse(req.body.viewer);
    req.body.member = JSON.parse(req.body.member);

    if (!(owner && member)) {
      res.status(200).send({
        success: false,
        message: "All input is required",
      });
    } else {
      req.body.file = [];
      req.files.map((item) => {
        if (item.mimetype.split("/")[0] == "image") {
          req.body.logo = item.filename;
        } else {
          req.body.file.push(item.filename);
        }
      });
      const Team = new team(req.body);
      Team.save().then((item) => {
        res.status(200).send({
          success: true,
          message: "Team successfully made",
          data: item,
        });
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
exports.getteam = async (req, res) => {
  try {
    const data = await team.find(req.query).exec();

    if (data.length == 0) {
      res
        .status(200)
        .send({ message: "There is no any plan available", success: false });
    } else {
      res.status(200).send({
        message: "Teams data get successfully",
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

exports.updateteam = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      team.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          if (req.body?.prevfile) {
            req.body.prevfile = JSON.parse(req.body.prevfile);
          }

          if (req.files) {
            const file = [];
            req.files.map((item) => {
              if (item.mimetype.split("/")[0] == "image") {
                req.body.logo = item.filename;
              } else {
                file.push(item.filename);
              }
            });
            if(file.length>0){
              req.body.file = file
            }

            
          }

          team.updateOne({ _id: id }, req.body, (err, value) => {
            if (err) {
              res.status(200).send({ message: err.message, success: false });
            } else {
              res.status(200).send({
                message: "Data updated Successfully",
                success: true,
                data: value,
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

exports.deleteteam = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      team.findOne({ _id: id }, async (err, result) => {
        if (result) {
          subscription.deleteOne({ _id: id }, (err, val) => {
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

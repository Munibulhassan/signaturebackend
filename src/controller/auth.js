const authentication = require("../models/auth");
var bcrypt = require("bcryptjs");
const { tokengenerate } = require("../middleware/auth");
const subscription = require("../models/subscription");
const { isBuffer } = require("util");
const e = require("express");

exports.register = async (req, res) => {
  try {
    const { first_name, email, password, profile } = req.body;
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!(first_name && email && password && profile)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else if (!re.test(email)) {
      res.status(422).send({ message: "invlaid Email", success: false });
    } else {
      authentication.findOne({ email: email }, async (err, data) => {
        if (data) {
          res.status(200).send({
            message: "User already exist with same email address",
            success: false,
          });
        } else {
          var salt = bcrypt.genSaltSync(10);
          req.body.password = bcrypt.hashSync(req.body.password, salt);

          req.body.subscription = await subscription.findOne({ name: "free" })
            ._id;

          req.body.sign = 0;

          const Authentication = new authentication(req.body);
          Authentication.save().then((item) => {
            
            res.status(200).send({
              message: "Data save into Database",
              data: item,
              token: tokengenerate(item),
              success: true,
            });
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
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    }

    authentication.findOne({ email: email }, (err, result) => {
      if (!result) {
        res.status(200).send({ message: "User not Exist", success: false });
      } else {
        if (!result.password) {
          res.status(200).send({
            message: "first register yourself",
            success: false,
          });
        } else if (bcrypt.compareSync(password, result.password)) {
          
          res.status(200).send({
            message: "Login Successfull",
            success: true,
            token: tokengenerate(result),
            data: result,
          });
        } else {
          res.status(200).send({ message: "Password invalid", success: false });
        }
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getusers = (req, res) => {
  try {
    if (req.query) {
      authentication.find(req.query, { password: 0 }, (err, result) => {
        if (err) {
          res.status(200).json({
            success: false,
            message: "Error occured!",
          });
        } else {
          if (result.length == 0) {
            res.status(200).json({
              success: false,
              message: "No user are found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "User get successfully",
              data: result,
            });
          }
        }
      });
    } else {
      authentication.find({}, { password: 0 }, (err, result) => {
        if (err) {
          res.status(200).json({
            success: false,
            message: "Error occured!",
          });
        } else {
          if (result.length == 0) {
            res.status(200).json({
              success: false,
              message: "No user are found",
            });
          } else {
            res.status(200).json({
              success: true,
              message: "User get successfully",
              data: result,
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
const nodemailer = require("nodemailer");
const auth = require("../models/auth");

exports.sendinvites = async (req, res) => {
  try {
    const { email } = req.body;
    if (email || email.length > 0) {
      req.body.email.map(async (item, index) => {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            user: "oipdummy@gmail.com", // generated ethereal user
            pass: "rimgrsvekbsqgman", // generated ethereal password
          },
        });
        let info = await transporter.sendMail({
          from: "oipdummy@gmail.com", // sender address
          to: { item }, // list of receivers
          subject: "Hello ✔", // Subject line
          text: "Hello world?", // plain text body
          html: "<b>Hello world?</b>", // html body
        });

        if (index == email.length - 1) {
          res.status(200).json({
            success: true,
            message: "Invitation send to given email address",
          });
        }
      });
    } else {
      res.status(200).json({
        success: false,
        message: "No emails provided",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.fileupload = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      profile: req.file.filename,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateprofile = async (req, res) => {
  try {
    
    if (!req.user._id) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      authentication.updateOne(
        { _id: req.user._id },
        req.body,
        async (err, result) => {
          if (err) {
            res.status(200).send({
              message: "Error Occured in update data",
              success: false,
            });
          } else {
            res.status(200).send({
              message: "Profile Updated Successfully",
              success: true,
              data: await authentication.findOne({ _id: req.user._id }),
            });
          }
        }
      );
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatepassword = async (req, res) => {
  try {
    if (!req.user._id) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const { password, newpassword, confirmpassword } = req.body;

      const data = await authentication.findOne({ _id: req.user._id });
      if (newpassword == confirmpassword) {
        

        if (bcrypt.compareSync(password, data.password)) {
          var salt = bcrypt.genSaltSync(10);

          authentication.updateOne(
            { _id: req.user._id },
            { password: bcrypt.hashSync(newpassword, salt) },
            async (err, result) => {
              if (err) {
                res.status(200).send({
                  message: "Error Occured in update data",
                  success: false,
                });
              } else {
                res.status(200).send({
                  message: "Profile Updated Successfully",
                  success: true,
                  data: await authentication.findOne({ _id: req.user._id }),
                });
              }
            }
          );
        } else {
          res.status(200).send({
            message: "Previous password is incorrect",
            success: false,
          });
        }
      } else {
        res.status(200).send({
          message: "New and Confirm password must be same",
          success: false,
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

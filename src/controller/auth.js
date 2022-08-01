const authentication = require("../models/auth");
var bcrypt = require("bcryptjs");
const { tokengenerate } = require("../middleware/auth");

exports.register = async (req, res) => {
  try {
    const { first_name, email, password } = req.body;
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!(first_name && email && password)) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else if (!re.test(email)) {
      res.status(422).send({ message: "invlaid Email", success: false });
    } else {
      authentication.findOne({ email: email }, async (err, data) => {
        if(data){
          res.status(200).send({
            message: "User already exist with same email address",
            
            success: false,
          });
        }else{

          var salt = bcrypt.genSaltSync(10);
          req.body.password = bcrypt.hashSync(req.body.password, salt);
          req.body.sign = 3;
          const Authentication = new authentication(req.body);
          Authentication.save().then((item) => {
            item.password = "";
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
            message: "first register yourseld",
            success: false,
          });
        } else if (bcrypt.compareSync(password, result.password)) {
          result.password = "";
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

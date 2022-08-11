const subscription = require("../models/subscription");
const authentication = require("../models/auth");
exports.subscribed = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const user = await authentication
        .findOne({ _id: req.user._id })
        .populate({ path: "subscription" })
        .exec();

      if (user?.subscription?._id == subscription) {
        res.status(200).send({
          message: "You already subscribed this package",
          success: false,
        });
      } else {
        await authentication.updateOne({ _id: req.user._id }, req.body);

        res
          .status(200)
          .send({ message: "Subscription Plan is subsribed", success: false });
      }
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
exports.cancelsubscription = async (req, res) => {
  try {
    const user = await authentication
      .findOne({ _id: req.user._id })
      .populate({ path: "subscription" });
    if (user?.subscription?._id) {
      user.subscription = await subscription.findOne({ name: "free" })._id;

      user.save();
      // await authentication.updateOne({_id: req.user._id},{ subscription: undefined, interval:undefined })
      // await product.updateOne(
      //   { vendor: req.user._id },
      //   { subscription: undefined, interval:undefined }
      // );

      res.status(200).send({
        message: "Subscription Plan is cancelled successfully",
        success: false,
      });
    } else {
      res.status(200).send({
        message: "You have no subscribed any subscription",
        success: false,
      });
    }
  } catch (err) {
    res.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
exports.createsubscription = async (req, res) => {
  try {
    const { name, description, monthlyamount, yearlyamount, documents } =
      req.body;

    if (
      !(
        name &&
        description &&
        monthlyamount >= 0 &&
        yearlyamount >= 0 &&
        documents
      )
    ) {
      res
        .status(200)
        .send({ message: "All input is required", success: false });
    } else {
      const Subscription = new subscription(req.body);
      Subscription.save().then((item) => {
        res.status(200).send({
          message: "Subscription Plan is created Successfully",
          success: true,
          data: item,
        });
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getsubscription = async (req, res) => {
  try {
    const data = await subscription
      .find(req.query)

      .exec();

    if (data.length == 0) {
      res
        .status(200)
        .send({ message: "There is no any plan available", success: false });
    } else {
      res.status(200).send({
        message: "Subscription plane Successfully fetch ",
        success: true,
        data: data,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatesubscription = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      subscription.findOne({ _id: id }, async (err, result) => {
        if (!result) {
          res.status(200).send({ message: "No Data Exist", success: false });
        } else {
          subscription.updateOne({ _id: id }, req.body, (err, result) => {
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

exports.deletesubscription = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(200).send({ message: "id is not specify", success: false });
    } else {
      subscription.findOne({ _id: id }, async (err, result) => {
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

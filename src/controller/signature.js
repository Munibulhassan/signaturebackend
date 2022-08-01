const authentication = require("../models/auth");
const signature = require("../models/signature");

exports.signme = async (req, res) => {
  try {
    console.log(req.user);

    req.body.status = req.params.status.toLowerCase();
    req.body.user = req.user._id;
    const { title } = req.body;
    if (!title && req.files.length <= 0) {
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
        req.body.signer = JSON.parse(req.body.signer);
        const Signature = new signature(req.body);
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
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

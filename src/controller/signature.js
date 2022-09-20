const authentication = require("../models/auth");
const signature = require("../models/signature");

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
        // if (req.body.signer) {
        //   req.body.signer = JSON.parse(req.body.signer);
        // }
        // if (req.body.viewer) {
        //   req.body.viewer = JSON.parse(req.body.Viewer);
        // }
        //  req.files.map((item,index)=>{
        //   const arr = []
        //   arr.push(item.filename)
        //   if(index == req.files.length-1){
        //     req.body.file = arr
        //   }

        // });

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
    
    if (query) {


      const data = await signature.find(query).populate("owner").exec();

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
      
      const data = await signature.find({}).populate("owner").exec();

      if (data.length == 0) {
        res.status(200).send({
          message: "There is no any signature available",
          success: false,
        });
      } else {
        
        if (title.length > 0) {
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

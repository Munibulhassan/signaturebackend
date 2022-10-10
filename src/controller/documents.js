const documents = require("../models/document");

exports.createdocuments = async (req, res) => {
  try {

    

    
    req.body.owner = req.user._id;    
    const Documents = new documents(req.body);
    Documents.save().then((item) => {
      res.status(200).send({
        success: true,
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
    req.query = Object.fromEntries(
      Object.entries(req.query).filter(
        ([_, v]) => v != "" && v != " " && v != "null"
      )
    );

    const { title, ...query } = req.query;

    // Object.assign(req.query, { createdby: req.user._id });

    const data = await documents.find(query).populate("owner").exec();
    if (data.length == 0) {
      res
        .status(200)
        .send({ message: "There is no documents available", success: false });
    } else {
      

      // var filterdata = [];
      // if (req.body.signer) {
      //   data.map((item) => {
      //     for (var i = 0; i < item?.signedby.length; i++) {
      //       if (item.signedby[i].email == req.body.signer) {
      //         filterdata.push(item);
      //         break;
      //       }
      //     }
      //   });
      // } else {
      //   filterdata = data;
      // }
      if (title?.length > 0) {
        data = data.filter((item) => {
          return item.title.search(title) != -1;
        });
      }
      res.status(200).send({
        message: "All documents fetch ",
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

exports.fileupload = async (req,res)=>{
  try{
    
    res.status(200).json({
      success: true,
      file: req.file.filename,      
    });
  }catch(err){
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
}
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
            if(req.file){
              req.file.document = req.file.filename
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

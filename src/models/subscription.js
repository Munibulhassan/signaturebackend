const mongoose = require("mongoose");

const subscription = mongoose.Schema(
  {
    name: String,
    description:String,
    monthlyamount: Number,
    yearlyamount: Number, 
    documents : String,
    googledrive :{type:Boolean, default:true},
    onedrive :{type:Boolean, default:true},
    teammanagement :{type:Boolean, default:true},
    custommanagement :{type:Boolean, default:true},    
  },
  { timestamps: true }
);

module.exports = mongoose.model("subscription", subscription);

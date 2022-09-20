const mongoose = require("mongoose");
const signature = mongoose.Schema(
  {
    type: { type: String, enum: ["me", "team", "bulk"] },    
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    status:{type:String,enum:["DRAFT","COMPLETED","AWAITINg","RECEIVED"], default:"DRAFT"},
    title:{type:String},
    viewer:[{name:String,email:String}],
    description:{type:String},
    file:{type:[]},
    signer:[{name:String,email:String}],
  },

  { timestamps: true }
);

module.exports = mongoose.model("signature", signature);

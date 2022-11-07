const mongoose = require("mongoose");
const signaturedoc = mongoose.Schema(
  {
    type: { type: String, enum: ["me", "team", "bulk"] },    
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    status:{type:String,enum:["DRAFT","COMPLETED","AWAITINg","RECEIVED"], default:"DRAFT"},
    title:{type:String},
    viewer:[{name:String,email:String}],
    description:{type:String},
    file:{type:[]},
    signer:[{name:String,email:String}],
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "folder" },

  },

  { timestamps: true }
);

module.exports = mongoose.model("signaturedoc", signaturedoc);

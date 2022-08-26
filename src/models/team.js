const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const team = mongoose.Schema(
  {
    
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    member : [],
    file : [],
    logo:String,

    viewer:[],
    name:String,
    logo:String
  },
  { timestamps: true }
);

module.exports = mongoose.model("team", team);

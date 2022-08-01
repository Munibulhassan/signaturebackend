const mongoose = require("mongoose");
const signature = mongoose.Schema(
  {
    status: { type: String, enum: ["me", "team", "bulk"] },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    title:{type:String},
    Viewer:{type:String},
    message:{type:String},
    file:{type:[]},
    signer:{type:[]},
  },

  { timestamps: true }
);

module.exports = mongoose.model("signature", signature);

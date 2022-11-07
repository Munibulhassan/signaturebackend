const mongoose = require("mongoose");
const signature = mongoose.Schema(
  {
    fullname: { type: String },
    initial: { type: String },

    initial: { type: String },
    fontStyle: { type: String },
    type: { type: String, enum: ["type", "draw", "upload"] },
    draw: { type: String },
    drawinitial: { type: String },
    image: { type: String },
    imageinitial: { type: String },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("signature", signature);

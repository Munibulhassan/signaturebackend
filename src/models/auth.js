const mongoose = require("mongoose");
const auth = mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    first_name: String,
    googleId: String,
    password: String,
    user_type: {
      type: String,
      enum: ["admin", "superadmin", "user"],
    },
    subscription:[{type: mongoose.Schema.Types.ObjectId, ref: "subscription"}],

    
    profile:String,
    sign:{type:Number}

  },
  { timestamps: true }
);

module.exports = mongoose.model("users", auth);

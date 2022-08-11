const mongoose = require("mongoose");
const folder = mongoose.Schema({
    name: String,
    createdby:{type: mongoose.Schema.Types.ObjectId, ref: "users"},
    document:[{type: mongoose.Schema.Types.ObjectId, ref: "document"}]
    

}, { timestamps: true });
module.exports = mongoose.model("folder", folder);

const mongoose = require("mongoose");
const document = mongoose.Schema({
    document: String,
    name:String,
    status:{type:String,enum:["DRAFT","COMPLETED","AWAITINg","RECEIVED"], default:"DRAFT"},
    createdby: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    signedby:[],
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "folder" },

}, { timestamps: true });
module.exports = mongoose.model("document", document);

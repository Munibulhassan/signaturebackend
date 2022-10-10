const mongoose = require("mongoose");
const document = mongoose.Schema({
    document: String,
    title:String,
    description:String,
    status:{type:String,enum:["DRAFT","COMPLETED","AWAITINg","RECEIVED"], default:"DRAFT"},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    signedby:[],
    viewedby:[],
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "folder" },
}, { timestamps: true });
module.exports = mongoose.model("document", document);

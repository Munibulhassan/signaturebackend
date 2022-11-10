const express = require("express");
const folder = require("./folder/folder");
const app = express();
const auth = require("./auth/auth");
const documents = require("./documents/document");

const signature = require("./signature/signature");
const signdocument = require("./signdocument/signdocument")
const subscription = require("./subscription/subscription");
const team = require("./team/team");
const { verifytoken } = require("../middleware/auth");

app.use("/auth", auth);
app.use("/signdoc", signdocument);
app.use("/signature", signature);
app.use("/subscription", subscription);
app.use("/team", team);
app.use("/document", documents);
app.use("/folder", folder);
app.use((req, res, next) => {
    console.log(req.url)
    next()
})
app.get("/getkey",verifytoken,(req,res)=>{
if(req.user){
    res.send({"APIkey":process.env.API_KEY})
}else{
    res.send({"error":"Token is invalid"})
}
})
module.exports = app;

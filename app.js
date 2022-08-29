const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Cryptr = require("cryptr");
const User = require("./user");
const cryptr = new Cryptr("myTotallySecretKey");
mongoose.Promise = require('bluebird');

app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://localhost:8000?retryWrites=true&w=majority",
  () => {
    console.log("connected");
  },
  (e) => console.error(e)
);

 app.post("/encrypt", async (req, res) => {
      let JSONData = req.body;
      let name = JSONData["name"];
      let user = new User({
            name: cryptr.encrypt(name),
   });
            await user.save();
            res.send("Sent");
            
    
    });

//decrypt code

app.get("/get", async (req, res) => {
  const name = await User.find({});
    name.forEach(n => {
     if(name){
        let newData= n.name;
        let data = cryptr.decrypt(newData)
       return res.json(data);
       
      }else{
    
         
        return res.status(504)
    }
  
   });
  
 });

app.listen(8000, () => {
  console.log(`Example app listening on port 8000`);
});
 

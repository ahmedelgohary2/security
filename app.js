//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

// console.log(process.env.SECERT);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});
const userSchema = new mongoose.Schema({
  email : String,
  password : String
});



// const secret = "thisMyFirstEncryption";

// userSchema.plugin(encrypt, {secret: process.env.SECERT, encryptedFields: ['password']});

const User = mongoose.model("user",userSchema );

app.get("/",(req,res)=>{
  res.render("home");
});
app.get("/login",(req,res)=>{
  res.render("login");
});
app.post("/login",(req,res)=>{
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email: req.body.username},(err,foundUser)=>{
    if (err) {
      console.log(err);
    } else {
    if (foundUser) {
      bcrypt.compare(password, foundUser.password, function(err, result) {
        if (result === true) {
          res.render("secrets");
        }

});
    }
  };

});
});
app.get("/register",(req,res)=>{
  res.render("register");
});
app.post("/register",(req,res)=>{
  bcrypt.hash(req.body.password,saltRounds, (err, hash)=>{
    const newUser = new User ({
      email : req.body.username,
      password : hash
    });
    newUser.save((err)=>{if (!err) {res.render("secrets")}});
 });
});

// User.findOne({email: req.body.username},(foundUser)=>{
//
//     if (foundUser.password === password ){res.render("secrets");}
//
// });


















app.listen(3000, function() {
  console.log("Server started on port 3000");
});

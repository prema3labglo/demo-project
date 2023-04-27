const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const serverless=require("serverless-http")
const router=express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const jwt = require('jsonwebtoken');
var cookieParser=require("cookie-parser")

app.use(express.json());
app.use(cookieParser())
const User = require("./model/Usermodel");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const secretkey="amrepamrepamrep"

var allowedOrigins = ['http://localhost:3000',
                      'https://profound-dasik-b0e766.netlify.app'];
                    
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

DB =
  "mongodb+srv://premalabglo:5WOQ11iochIoRmS4@cluster0.varcrvt.mongodb.net/demodata?retryWrites=true&w=majority";

const salt = bcrypt.genSaltSync(5);

mongoose
  .connect(DB)
  .then(() => {
    console.log("connected successfully");
  })
  .catch(() => {
    console.log("connection failed");
  });

app.get("/", function (req, res) {
  res.send("welcome ");
});

app.post("/register", async (req, res) => {
  try {
    const { username, password, DOB, qualification, place } = req.body;
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
      DOB,
      qualification,
      place,
    });

    if (userDoc) {
      res.json({ success: "Success" });
    }
   
    }
   catch (e) {
    res.status(400).json("cant create user");
  }
});

app.post("/login",async(req,res)=>{
  try{
    const {username,password}=req.body;
    const userDoc = await User.findOne({ username: username });
    
    if(userDoc) {
      const passOk=bcrypt.compareSync(password,userDoc.password)
      console.log(passOk)
      if(passOk) {
        jwt.sign({username,_id:userDoc._id},secretkey,{},(err,token)=>{
          if(err) throw err;
          res.cookie("token",token,{
            httpOnly:true
          })
          res.send(userDoc).json();
        })
      }
      else{
        res.status(400).json("wrong credentials");
      }
    } 
    else {
      res.status(400).json("Invalid Username")
    }
  }
    catch (e) {
      res.status(400).json(`Error In Login -> ${e}`)
    }
})

app.get("/users", async(req, res) => {
  try {
    const userDocs = await User.find({});
    if (userDocs) {
      res.status(200).json(userDocs);
    } else {
      res.json({ message: "Cant get users" });
    }
  } catch (e) {
    res.status(400).json(e);
  }
  

});

app.get(`/singleuser/:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

app.put(`/useredit/:id`, async (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.params.id },
    {
      username: req.body.username,
      password: req.body.password,
      DOB: req.body.DOB,
      qualification: req.body.qualification,
      place: req.body.place,
    }
  )
    .then(() => {
      res.status(201).json({
        message: "updated sucessfully",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
});

app.delete(`/userdelete/:id`, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    console.log("user",user)
    if (user) {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

var server = app.listen(4000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;

module.exports.handler=serverless(app)

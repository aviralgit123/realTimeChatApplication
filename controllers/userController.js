const status  = require('http-status');
const mongoose= require("mongoose");
const User= mongoose.model("User");
const sha256= require("js-sha256");
const jwt=require('jwt-then');
exports.register = async (req, res) => {
   const {name,email,password}=req.body;
   const emailRegex=/[@gmail.com|@yahoo.com|@hotmail.com|@live.com]$/;
   if(!emailRegex.test(email)){
        return res.send(status.NOT_ACCEPTABLE);
   }
   if(password.length<6){
     return res.send(status.REQUESTED_RANGE_NOT_SATISFIABLE);
   }
   const userCheck= await User.findOne({
    email,
    password:sha256(password+process.env.SALT)
    })
    if(userCheck){
        return res.send("User Already Exist")
    }
   const user=new User({name,email,password:sha256(password+process.env.SALT)});
   await user.save();
    res.send('User Register Sucessfully');
  };

exports.login =async(req, res) => {
    const {email,password}=req.body;
    const user= await User.findOne({
        email,
        password:sha256(password+process.env.SALT)
    })
    if(!user){
        return res.send(status.NOT_FOUND);
    }
    const token = await jwt.sign({id:user.id,name:user.name}, process.env.SECRET);
   
    res.json({
        message:"User Logged in Sucessfully!",
        access_token:token
    });
  };
  

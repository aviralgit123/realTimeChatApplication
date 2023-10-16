const mongoose= require('mongoose');
const Chatroom=mongoose.model("Chatroom");
exports.createChatroom= async(req,res)=>{
    const{name}=req.body;
    const nameRegex=/^[A-Za-z\S]+$/;
    if(!nameRegex.test(name)){
        return "Chatroom name can contain only alphabets.";
    }
    const chatroomExists= await Chatroom.findOne({name});
    if(chatroomExists){
        return "User Already Exist";
    }
    const chatroom=new Chatroom({
        name
    });
    
    await chatroom.save();
    res.json({
        message:"Chatroom created!"
    })
}

exports.getAllChatroom=async(req,res)=>{
    const chatroom=await Chatroom.find({});
    res.json(chatroom);
}
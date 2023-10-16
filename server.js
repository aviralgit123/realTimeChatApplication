require('dotenv').config();
const mongoose= require("mongoose");

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error',(err)=>{
  console.log("Mongoose Connection ERROR:"+ err.message);  
});

mongoose.connection.once('open',()=>{
    console.log("MongoDB Connected!");
})
require('./models/User');
require('./models/Chatroom');
require('./models/Message');

const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const jwt=require("jwt-then");
io.use(async(socket,next)=>{
  try{
    const token= socket.handshake.query.token;
    const chatroomid= socket.handshake.query.chatroomid;
    const Chatroom=mongoose.model("Chatroom");
    const chatroomname= await Chatroom.findOne({_id:chatroomid});
    const payload= await jwt.verify(token,process.env.SECRET);
    socket.username=payload.name;
    socket.chatroomname=chatroomname.name;
    socket.chatroomid=chatroomid;
    next(); 
  }catch(err){}
});
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
   
  });
  socket.on(socket.chatroomid, (msg) => {
    io.emit(socket.chatroomid, msg +"(Send by "+ socket.username+")");
  });
});
server.listen(8001,()=>{
    console.log("Server listening on port 8001");
})
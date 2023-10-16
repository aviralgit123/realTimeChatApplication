const router= require('express').Router();
const chatroomController=require("../controllers/chartroomController");
const auth = require("../middlewares/auth")
router.post("/",auth,chatroomController.createChatroom);
router.get("/",auth,chatroomController.getAllChatroom);

module.exports=router;
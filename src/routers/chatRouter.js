const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ChatModel = require("../models/chat");
const UserModel = require("../models/user");
const chatRouter = express.Router();

chatRouter.get("/chat/:targetId", userAuth,  async (req, res) => {

    try{
        const { targetId } = req?.params;
        const user = req?.user;
        const userId = user?._id;

        //@todo need to add proper validations

        //searching for chat for logged in user
        const chat = await ChatModel.findOne({participants: {$in: [userId, targetId]}}).populate(
            {path: "messages.fromUserId", select: "firstName lastName"}
        ).populate("participants", "firstName lastName");
        if(!chat){
            //create a chat if no chat found
            const newChat = new ChatModel({
                participants: [userId,targetId],
                messages: []
            });

            await newChat.save();

        }
        
        //console.log(chat);
        res.status(200).json({
            message: "Successfully fetched user chat.",
            data: chat
        });


    }catch(err){
        
        res.status(500).json({
            message: "Error in fetching user chat",
            data: err
        });
    }

});

module.exports = chatRouter;
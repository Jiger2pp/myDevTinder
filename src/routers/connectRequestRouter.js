const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const UserModel = require('../models/user');
const connectRequestRouter = express.Router();


connectRequestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {

    try{

        const {toUserId, status} = req.params;
        const loggedInUser = req.user;

        const connectionRequest =  new ConnectionRequest({
            fromUserId: loggedInUser._id,
            toUserId: toUserId,
            status: status
        });

        const ALLOWED_STATUSES = ["interested", "ignore"];
        // Check if the status is valid
        if(!ALLOWED_STATUSES.includes(status)){
            return res.status(400).json({
                message: 'Invalid status'
            });

        }
        // Check if the logged-in user is trying to send a request to themselves
        if(toUserId === loggedInUser._id.toString()){
            return res.status(400).json({
                message: 'You cannot send a connection request to yourself!!!'
            });

        }
        // Check if the touser exists
        const toUser = await UserModel.findById(toUserId);
        
        if(!toUser){
            return res.status(400).json({
                message: 'User not found'
            });
        }
        // Check if the connection request already exists
        const connectionRequestData = await ConnectionRequest.findOne({ 
            $or : [
                    {fromUserId: loggedInUser._id, toUserId: toUserId}, 
                    {fromUserId: toUserId, toUserId: loggedInUser._id}
                  ]
        });
        if(connectionRequestData){
            return res.status(400).json({
                message: 'Connection request already sent'
            });
        }

        //save the connection request to database
        await connectionRequest.save();
        res.status(200).json({
            message: 'Connection request sent successfully'
        });

    }catch(err){
        res.status(500).json({
            message: 'Error adding connection request',
            error: err
        });     

    };

});

//Accept or reject connection request API
connectRequestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {

    try{

        const {status, requestId} = req.params;
        const loggedInUserId = req.user._id;
        const ALLOWED_STATUSES = ["accepted", "rejected"];

        if(!ALLOWED_STATUSES.includes(status)){
            return res.status(400).json({
                message: "Invalid status"
            });
        }
        const connectionRequest = await ConnectionRequest.findOne({_id: requestId, toUserId: loggedInUserId, status: "interested"});
        if(!connectionRequest){
            return res.status(404).json({
                message: "Connection request not found"
            });
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.status(200).json({
            message: "Connection updated successfully!!",
            data: data
        });

    }catch(err){

        return res.status(500).json({
            message: "Error fetching connection request",
            error: err
        });

    }

});

module.exports = connectRequestRouter;

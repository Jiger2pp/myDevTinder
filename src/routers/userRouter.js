const express = require('express');
const UserModel = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();


//Pending connections API
userRouter.get("/user/request/received", userAuth, async(req, res) => {

    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({ $or: [{"fromUserId" : loggedInUser._id}, {"toUserId" :  loggedInUser._id}], $and: [{status: "interested"}]}).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);
        if(connections.length === 0){
            return res.status(404).json({
                message: "No connections found"
            });

        }
        // const data = connections.map((row) => {            

        //     if(row.fromUserId._id.equals(loggedInUser._id)){                            
        //         return row.toUserId;
        //     }
        //     return row.fromUserId;

        // });
        res.status(200).json({
            message: "Connection requests fetched successfully",
            connections: connections
        });
        

    }catch(err){
        res.status(500).json({
            message: "Error fetching connections",
            error: err
        });
    }

});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({ $or: [{"fromUserId" : loggedInUser._id}, {"toUserId" :  loggedInUser._id}], $and: [{status: "accepted"}]}).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);
        if( (typeof connections === "undefined") || (typeof connections !== "undefined" && connections.length === 0 )){
            return res.status(404).json({
                message: "No connections found"
            });

        }
        const data = connections.map((row) => {
            
            if(row.fromUserId._id.equals(loggedInUser._id)){                
                return row.toUserId;
            }
            return row.fromUserId;

        });
        res.status(200).json({
            message: "Connection fetched successfully",
            connections: data
        });
        

    }catch(err){
        res.status(500).json({
            message: "Error fetching connections",
            error: err
        });
    }

});

//Get user feed API
userRouter.get("/user/feed", userAuth, async(req, res) => {

    const loggedInUser = req.user;
    try{

        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page -1) * limit;

        //Get all users except loggedin user and user to which connection request sent or in connection
        const connections = await ConnectionRequest.find({$or: [{fromUserId: {$eq: loggedInUser._id}}, {toUserId: { $eq: loggedInUser._id}}] });  
        const myAllConnections = new Set();
        connections.forEach( row => { myAllConnections.add(row.fromUserId.toString()); myAllConnections.add(row.toUserId.toString());});

        const myFeed  = await UserModel.find( {_id: {$nin: Array.from(myAllConnections) } } ).select(["firstName", "lastName", "skills", "gender", "age"]).skip(skip).limit(limit);

        if(myFeed.length === 0){
            return res.status(404).json({
                message: "No user feeds found"
            });

        }
        
        res.status(200).json({
            message: "All connections of " + loggedInUser.firstName + " " + loggedInUser.lastName + " are  listed now.",
            data : myFeed
        });

        
    }catch(err){
        res.status(500).json({
            message: "Error fetching user feed",
            error: err
        });

    }

});



module.exports = userRouter;
const express = require('express');
const UserModel = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const userRouter = express.Router();



//Get User feed API
userRouter.get('/user/feed', userAuth, (req, res) => {   
    
    UserModel.find({}).then((userFeed) => {     
        res.status(200).json({
            message: userFeed.length > 0 ? 'Users fetched successfully' : 'No users found',
            users:  userFeed
        });

    }).catch((err) => {
        res.status(500).json({
            message: 'Error fetching users',
            error: err
        });

    });
});

//Pending connections API
userRouter.get("/user/request/received", userAuth, async(req, res) => {

    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({ $or: [{"fromUserId" : loggedInUser._id}, {"toUserId" :  loggedInUser._id}], $and: [{status: "accepted"}]}).populate("fromUserId", ["firstName", "lastName"]).populate("toUserId", ["firstName", "lastName"]);
        if(connections.length === 0){
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
            message: "Connections fetched successfully",
            connections: data
        });
        

    }catch(err){
        res.status(500).json({
            message: "Error fetching connections",
            error: err
        });
    }

});

userRouter.get("/user/connections", userAuth, async (req, res) => {
    res.status(200).json({
        message: "In progress!!!",
        connections: connections
    });
});



module.exports = userRouter;
const express = require('express');
const UserModel = require('../models/user');
const { userAuth } = require('../middlewares/auth');
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



module.exports = userRouter;
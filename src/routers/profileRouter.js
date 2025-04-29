const express = require('express');
const {userAuth} = require('../middlewares/auth');
const UserModel = require('../models/user');
const { validateInputFields, validateUpdatePasswordFields} = require('../utils/validation');
const bcrypt  = require("bcrypt");
const profileRouter = express.Router();



//Get user profile API
profileRouter.post("/profile/view", userAuth, (req, res) => {  

    res.status(200).json({
        message: 'User profile fetched successfully',
        user: req.user
    });

});

//Update user profile API
profileRouter.put('/profile/edit', userAuth, (req, res) => {

    try{
        // Validate the request body    
        validateInputFields(req);        
        
        const loggedInUser = req.user; // Get the user ID from the authenticated user    
        Object.keys(req.body).forEach( (key) => { loggedInUser[key] = req.body[key]});
        loggedInUser.save().then(() => {
            res.status(200).json({
                message: 'User profile updated successfully',
                user: loggedInUser
            });
        }).catch((err) => {
            res.status(500).json({
                message: 'Error updating user profile',
                error: err
            });
        });
    }catch(err){    
        res.status(400).json({
            message: err.message
        });     
    }    

});

//Get user profile update password API
profileRouter.put("/profile/password", userAuth, async(req,res) => {

    try{
        // Validate the request body    
        validateUpdatePasswordFields(req);        
        
        const {password} = req.body;
        const loggedInUser = req.user; // Get the user ID from the authenticated user
        //Hashing password before saving into DB
        const passwordHash = await bcrypt.hash(password, 10);     
        loggedInUser["password"] = passwordHash;
        //console.log(loggedInUser);    
        loggedInUser.save().then(() => {
            res.status(200).json({
                message: 'Password updated successfully',
                user: loggedInUser
            });
        }).catch((err) => {
            res.status(500).json({
                message: 'Error updating password',
                error: err
            });
        });
    }catch(err){
        res.status(400).json({
            message: err.message
        });  
    }           
        
});

//update user profile PATCH API
profileRouter.patch('/profile', (req, res) => {

    const userId = req.body.userId;
    const updatedData = req.body;

    UserModel.findByIdAndUpdate(userId, updatedData, { new: true }).then((user) => {
        res.status(200).json({
            message: user ? 'User updated successfully' : 'User not found',
            user: user
        });

    }).catch((err) => {
        res.status(500).json({
            message: 'Error updating user',
            error: err
        });

    });

});

//Delete user profile API
profileRouter.delete('/profile', (req, res) => {
    const userId = req.body.userId; 
    UserModel.findByIdAndDelete(userId).then(() => {
        res.status(200).json({
        message: 'User deleted successfully'
        });
    }).catch((err) => {
        res.status(500).json({
        message: 'Error deleting user',
        error: err
        });

    });

});


module.exports = profileRouter;
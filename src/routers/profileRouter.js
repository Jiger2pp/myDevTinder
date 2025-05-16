const express = require('express');
const {userAuth} = require('../middlewares/auth');
const UserModel = require('../models/user');
const { validateInputFields, validateUpdatePasswordFields} = require('../utils/validation');
const bcrypt  = require("bcrypt");
const UserPictureModel = require('../models/userPicture');
const profileRouter = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    return cb(null, 'uploads/users/picture');
  },
  filename: function(req, file, cb){
    const fileName =  Date.now() + '_' + file.originalname.replace(" ", "_");
    return cb(null, fileName);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype == 'image/jpeg'){
      return cb(null, true);
    }else{
      cb(null, false);
      return cb( new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const uploadImage = upload.single("userImage");


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

//upload user profile image/picture
profileRouter.post("/profile/picture", userAuth, uploadImage, async (req, res) => {
    
    try {
        const user = req.user;
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }
        let userPicture = await UserPictureModel.findOne({userId: user._id});
        if(!userPicture){
            userPicture = new UserPictureModel({
                userId: user._id,
                pictureUrl: req.file.filename
            });
        }
        userPicture.pictureUrl = req.file.filename;

        const pictureData = await userPicture.save();

        res.status(200).json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            filepath: req.file.path,
            data: pictureData
        });     
       
        
    } catch (err) {
        res.status(500).json({
            message: 'Error in uploading user picture',
            error: err
        });
    }
});

//get user profile picture
profileRouter.get("/profile/picture/:userId", userAuth, async (req, res) => {

    try {
        const user = req.user;
        const userPicture = await UserPictureModel.findOne({userId: user._id});
        //console.log(userPicture);
        if(!userPicture){
            return res.status(404).json({
                message: "User picture not found.",
                data: userPicture
            });
        }

        res.status(200).json({
            message: "User picture fetch successfully.",
            data: userPicture
        });
        
    } catch (err) {
        res.status(500).json({
            message: "Error in fetching user picture",
            error: err
        });
    }

});


module.exports = profileRouter;
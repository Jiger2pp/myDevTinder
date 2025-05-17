const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        trim: true
    },
    lastName:{
        type: String,
        minLength: 3,
        maxLength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: function(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email format");
            }
        }
    },
    password: {
        type: String,
        required: true,
        maxLength: 255,
        validate: function(value){ 
            if(!validator.isStrongPassword(value)){
                throw new Error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol");
            }
         }
    },
    gender: {
        type: String ,
        validate: function(value) { 
            if(!["Male","Female","Other"].includes(value)){
                throw new Error("Invalid gender. Must be either Male, Female, or Other");
            }
        }       
          
    },
    userPictureId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserPicture"
    },
    pictureUrl: {
        type: String,
        default: ""
    },
    about:{
        type: String,
        default: "Please write in short about yourself"
    },
    age:{
        type: Number,
        min: [5, 'Min age must be at least 5, but {VALUE} is given'],
        max: [100, 'Max age must be at most 100, but {VALUE} is given']
    },
    phone: {
        type: String,
        maxLength: 10,
        trim: true
    },
    skills:{
        type:[String],
        validate: function(value){
            if(value.length < 1){
                throw new Error("Skills must be at least 1");
            }
            if(value.length > 10){
                throw new Error("Skills must be at most 10");
            }

        }
    },   
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.jwtUserAuthenticationToken = async function(){

   const user = this;
    
   const token = await jwt.sign({"token": user._id}, process.env.JWT_TOKEN_SECRET );  
   
   return token;
    
}

userSchema.methods.checkForValidPassword = async function(passwordByReqBody){

    const user = this;
     
    const isPasswordValid = await bcrypt.compare(passwordByReqBody, user.password);  
    
    return isPasswordValid;
     
 }


// Create a model from the User schema now
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
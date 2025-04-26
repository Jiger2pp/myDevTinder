const mongoose = require('mongoose');
const {Schemsa} = mongoose;
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String    
    },
    age:{
        type: Number
    },
    phone: {
        type: String
    },    
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create a model from the User schema now
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
const mongoose = require("mongoose");
const {Schema} = mongoose;

const userPicture = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    pictureUrl:{
        require: true,
        type: String
    },
    timestamps: {
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }

});

const UserPictureModel = mongoose.model('UserPicture', userPicture);

module.exports = UserPictureModel;
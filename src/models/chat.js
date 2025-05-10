const mongoose = require("mongoose");

const { Schema } = mongoose;

const messageSchema = new Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },
    text: {
        type: [String]
    },
    timestamps : {
        createdAt : {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }

});

const chatSchema = new Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        retuired: true
    }],
    messages: [messageSchema],
    timestamps: {
        createdAt:{
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }
    

});

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;
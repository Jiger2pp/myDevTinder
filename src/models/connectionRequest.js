const mongoose = require('mongoose');

const {Schema} = mongoose;

const connectionRequestSchema = new Schema({

    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ["interested", "ignore", "accepted", "rejected"],
        message: "{VALUE} is not a valid status"
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

connectionRequestSchema.pre('save', function(next){
    const connectionRequest = this;
    
    if(connectionRequest.toUserId.equals(connectionRequest.fromUserId) ){
            
        const err = "You cannot send a connection request to yourself!!!";
        next(err);

    }
    
    next();
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
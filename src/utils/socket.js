const socket = require("socket.io");
const ChatModel = require("../models/chat");

const initializeSocket = (server) => {

    const io = socket(server, {cors: {
        origin: "http://localhost:5173",
        connectionStateRecovery: {}
    }});

    io.on('connection', (socket) => {
        
        socket.on("joinRoom", ({targetId, userId, firstName, isConnected}) => {
          const roomId = [targetId, userId].sort().join("_");          
          isConnected = socket.connected;                 
          socket.join(roomId);  
          io.to(roomId).emit("conectedToServer", {isConnected});     
                   
        });        

        //listen sendMessage event emitted by client and emit event back to client 
        socket.on("sendMessage", async ({targetId, userId, firstName, lastName, text}) => {

            try{

                const roomId = [targetId,userId].sort().join("_");
                //looking chat for target user id and user id
                const chat = await ChatModel.findOne({participants: {$in:[userId, targetId]}});
                if(!chat){

                    //no chat then create chat entry in the DB
                    const newChat = new ChatModel({
                        participants: [userId, targetId],
                        messages:[text]
                    });
                    await newChat.save();

                }else{
                                        
                    chat.messages.push({
                        fromUserId: userId,
                        text
                    });
                    await chat.save();

                }               
                const fromUserId = userId;
                const isConnected = socket.connected;                
                socket.to(roomId).emit("messageReceived", {fromUserId, firstName, lastName, text, isConnected});

            }catch(err){
                console.log(err);
            }            
        
        });     
      
        socket.on("disconnect", (reason) => {            
            
        });     
        
      
      });
      
      
      

}

module.exports = {
    initializeSocket
}
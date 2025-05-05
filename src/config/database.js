const mongoose = require('mongoose');
const MongoConnection = async() => {    
    await mongoose.connect(process.env.DATABASE_CONNECTION_STR);
}


module.exports = MongoConnection;
const mongoose = require('mongoose');
const MongoConnection = async() => {
    console.log(process.env.DATABASE_CONNECTION_STR);
    await mongoose.connect(process.env.DATABASE_CONNECTION_STR);
}


module.exports = MongoConnection;
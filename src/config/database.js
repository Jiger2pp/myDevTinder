const mongoose = require('mongoose');
const MongoConnection = async() => {
    await mongoose.connect('mongodb+srv://pankajpandeyjec:1JmIPE6W5rP07Pcs@pankaj-test-cluster.c6qdsvh.mongodb.net/myDevTinder');
}


module.exports = MongoConnection;
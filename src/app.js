const express = require('express');
const MongoConnection = require('./config/database');

const app = express();

const PORT = 3000;


MongoConnection().then(() => {
  console.log('MongoDB connection established');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
).catch((err) => {
  console.log('MongoDB Connection Failed');
  console.log(err);
}
);



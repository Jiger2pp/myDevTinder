const express = require('express');
const MongoConnection = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/authRouter');
const profileRouter = require('./routers/profileRouter');
const userRouter = require('./routers/userRouter');
const connectRequestRouter = require('./routers/connectRequestRouter');
const http = require('node:http');
const { initializeSocket } = require('./utils/socket');

require('dotenv').config();

const cors = require('cors');
const chatRouter = require('./routers/chatRouter');
const path = require('node:path');
const staticRouter = require('./routers/staticFileRouter');



const app = express();

//Need to create server now
const server = http.createServer(app);
//Init socket connection
initializeSocket(server);


app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json()); //middleware to parse JSON request body

app.use(cookieParser()); //middleware to parse cookies
app.use("/", staticRouter);
app.use("/", authRouter); //middleware to use authRouter
app.use("/", profileRouter); //middleware to use profileRouter
app.use("/", userRouter); //middleware to use userRouter
app.use("/", connectRequestRouter); //middleware to use connectRequestRouter
app.use("/", chatRouter); //middleware to use chat router

MongoConnection().then(() => {
  console.log('MongoDB connection established');
  server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
  });
}).catch((err) => {
  console.log('MongoDB Connection Failed');
  console.log(err);
});



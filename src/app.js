const express = require('express');
const MongoConnection = require('./config/database');
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/authRouter');
const profileRouter = require('./routers/profileRouter');
const userRouter = require('./routers/userRouter');
const connectRequestRouter = require('./routers/connectRequestRouter');


const app = express();

const PORT = 3000;

app.use(express.json()); //middleware to parse JSON request body

app.use(cookieParser()); //middleware to parse cookies

app.use("/", authRouter); //middleware to use authRouter
app.use("/", profileRouter); //middleware to use profileRouter
app.use("/", userRouter); //middleware to use userRouter
app.use("/", connectRequestRouter); //middleware to use connectRequestRouter

MongoConnection().then(() => {
  console.log('MongoDB connection established');
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.log('MongoDB Connection Failed');
  console.log(err);
});



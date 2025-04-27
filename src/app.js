const express = require('express');
const MongoConnection = require('./config/database');
const UserModel = require('./models/user');
const {validateSignUp} = require('./utils/validation');
const bcrypt  = require("bcrypt");

const app = express();

const PORT = 3000;

app.use(express.json()); //middleware to parse JSON request body

app.post('/signup', async (req, res) => {

  const VALID_INPUT = ["firstName", "email", "password", "skills"];
  const {firstName, lastName, email, password, skills} = req?.body;  

  VALID_INPUT.forEach((input) => {
      if (!Object.keys(req.body).includes(input)) {
        
        res.status(400).json({ message: `${input} is required`});         
        
      }
  
    });

  //validating sign up fields
  const errorMsg = validateSignUp(req);

  if(errorMsg){
    res.status(400).json({
      message: errorMsg 
    });
  }

  //Hashing password before saving into DB
  const passwordHash = await bcrypt.hash(password, 10);  
  
  const user = new UserModel({
    firstName,
    lastName,
    email,
    password: passwordHash,
    skills

  });  

  await user.save().then(() => {
    res.status(200).json({
      message: 'User added successfully',
      user: user
    });
  }).catch((err) => {
    res.status(500).json({
      message: 'Error adding user',
      error: err
    });
  }
  );
  

});

//User login API
app.post('/login', async (req, res) => {
  const {email, password} = req.body;

  await UserModel.findOne({email}).then( async(user) => { 
    if(!user){
      res.status(400).json({
        message: 'Invalid crendentials'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
      if(!isPasswordValid){
        res.status(400).json({
          message: 'Invalid crendentials'
        });

     }else{
        res.status(200).json({
          message: 'User logged in successfully'
        });
      }

  }).catch((err) => {
    res.status(500).json({
      message: 'Error updating user',
      error: err
    });

  }); 

});

//Get User feed API
app.get('/feed', async(req, res) => {   
    
    await UserModel.find({}).then((userFeed) => {
      res.status(200).json({
        message: userFeed.length > 0 ? 'Users fetched successfully' : 'No users found',
        users:  userFeed
      });

    }).catch((err) => {
      res.status(500).json({
        message: 'Error fetching users',
        error: err
      });

    });
});

//Get user profile API
app.post("/profile", (req, res) => {

  const userId = req.body.userId;

   UserModel.findById(userId).then((user) => {
    res.status(200).json({
      message: user ? 'User fetched successfully' : 'User not found',
      user: user
    });
  }
  ).catch((err) => {
    res.status(500).json({
      message: 'Error fetching user',
      error: err
    });
  }
  );

});

//Delete user profile API
app.delete('/profile', async (req, res) => {
  const userId = req.body.userId; 
  await UserModel.findByIdAndDelete(userId).then(() => {
    res.status(200).json({
      message: 'User deleted successfully'
    });
  }
  ).catch((err) => {
    res.status(500).json({
      message: 'Error deleting user',
      error: err
    });

  });

});

//Update user profile API
app.put('/profile', async (req, res) => {
  const userId = req.body.userId;
  const updatedData = req.body;

  await UserModel.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true }).then((user) => {
    res.status(200).json({
      message: user ? 'User updated successfully' : 'User not found',
      user: user
    });

  }).catch((err) => {
    res.status(500).json({
      message: 'Error updating user',
      error: err
    });

  }); 

});

//update user profile PATCH API
app.patch('/profile', async (req, res) => {
  
  const userId = req.body.userId;
  const updatedData = req.body;

  await UserModel.findByIdAndUpdate(userId, updatedData, { new: true }).then((user) => {
    res.status(200).json({
      message: user ? 'User updated successfully' : 'User not found',
      user: user
    });

  }
  ).catch((err) => {
    res.status(500).json({
      message: 'Error updating user',
      error: err
    });

  });

});



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



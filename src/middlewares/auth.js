const jwt = require('jsonwebtoken');
const UserModel = require('../models/user');

const userAuth = (req, res, next) => {

    jwt.verify(req.cookies.token, process.env.JWT_TOKEN_SECRET , function(err, decoded) {
        
        if (err) {
          return res.status(401).json({ message: 'Unauthorized access!!!' });
        }else{
          const userIdFRomToken = decoded.token;
          UserModel.findById(userIdFRomToken).then((user) => {
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
            req.user = user; // Attach the user to the request object
            next(); // Call the next middleware or route handler

          }).catch((err) => {
            res.status(500).json({
              message: 'Error fetching user',
              error: err
            });
          });
        }
    
      });

};

module.exports = {
    userAuth
};
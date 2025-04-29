const express = require('express');
const {validateInputFields} = require('../utils/validation');
const UserModel = require('../models/user');
const bcrypt  = require("bcrypt");
const authRouter = express.Router();



    authRouter.post('/signup', async (req, res) => {

        try{
            const VALID_INPUT = ["firstName", "email", "password", "skills"];
            const {firstName, lastName, email, password, skills} = req?.body;  
            
            VALID_INPUT.forEach((input) => {
                if (!Object.keys(req.body).includes(input)) {
                    
                    return res.status(400).json({ message: `${input} is required`});         
                    
                }
            
                });
            
            //validating sign up fields
            validateInputFields(req);       
            
            //Hashing password before saving into DB
            const passwordHash = await bcrypt.hash(password, 10);  
            
            const user = new UserModel({
                firstName,
                lastName,
                email,
                password: passwordHash,
                skills
            
            });  
            
            user.save().then(() => {
                res.status(200).json({
                message: 'User added successfully',
                user: user
                });
            }).catch((err) => {
                res.status(500).json({
                message: 'Error adding user',
                error: err
                });
            
            });
        }catch(err){
            res.status(500).json({
                message: 'Error adding user',
                error: err
            });     
        }        
      
    });

    //User login API
    authRouter.post('/login', (req, res) => {
        const {email, password} = req.body;

        UserModel.findOne({email}).then( async(user) => { 
            if(!user){
                return res.status(400).json({
                    message: 'Invalid crendentials'
                });
            }

            const isPasswordValid = await user.checkForValidPassword(password); //checking password
            if(!isPasswordValid){
                res.status(400).json({
                message: 'Invalid crendentials'
                });

            }else{
                //Generating JWT token
                const token = await user.jwtUserAuthenticationToken();         
                res.cookie('token', token);
                res.status(200).json({
                message: 'User logged in successfully'          
                });
            }

        }).catch((err) => {
            res.status(500).json({
            message: 'Error login user',
            error: err
            });

        }); 

    });

    authRouter.post("/logout", (req, res) => {

        res.clearCookie('token');
        res.status(200).json({
            message: 'User logged out successfully'
        });

    });



module.exports = authRouter;
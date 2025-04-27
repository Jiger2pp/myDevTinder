const validator = require('validator');

const validateSignUp = (req) => {

    
    const {firstName, lastName, email, password, skills} = req.body;    

    if(typeof firstName != "undefined" && (firstName.length < 3 || firstName.length > 50) ){
        return `Please enter valid first name.`;
    }

    if(typeof lastName != "undefined" && (lastName.length < 3 || lastName.length > 50) ){
        return `Please enter valid last name.`;
    }

    if(typeof password != "undefined" && !validator.isStrongPassword(password)){
        return `Please enter strong password.`;
    }

    if(typeof email != "undefined" && !validator.isEmail(email)){
        return `Please enter vaild email address.`;
    }

    if(typeof lastName != "undefined" && (skills.length < 1 || skills.length > 10) ){
        return `Skill should not be less than 1 and greater than 10.`;
    }

}

module.exports = {
    validateSignUp
}
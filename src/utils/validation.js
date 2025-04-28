const validator = require('validator');

const validateInputFields = (req) => {

    
    const {firstName, lastName, email, password, skills} = req.body;    

    if(typeof firstName != "undefined" && (firstName.length < 3 || firstName.length > 50) ){        
        throw new Error(`Please enter valid first name.`) ;
    }

    if(typeof lastName != "undefined" && (lastName.length < 3 || lastName.length > 50) ){        
        throw new Error(`Please enter valid last name.`) ;
    }

    if(typeof password != "undefined" && !validator.isStrongPassword(password)){        
        throw new Error(`Please enter strong password.`) ;
    }

    if(typeof email != "undefined" && !validator.isEmail(email)){        
        throw new Error(`Please enter vaild email address.`) ;
    }

    if(typeof skills != "undefined" && (skills.length < 1 || skills.length > 10) ){        
        throw new Error(`Skill should not be less than 1 and greater than 10.`) ;
    }

}

const validateUpdatePasswordFields = (req) => {
    const {password, confirmPassword} = req.body;
    

    if(typeof password != "undefined" && password.length === 0){
        throw new Error(`Please enter password.`) ;
    }else if(typeof password != "undefined" && !validator.isStrongPassword(password)){        
        throw new Error(`Please enter strong password.`) ;
    }
    if(typeof confirmPassword != "undefined" && confirmPassword !== password){       
        throw new Error(`Password and confirm password do not match.`) ;
    }

}

module.exports = {
    validateInputFields,
    validateUpdatePasswordFields
}
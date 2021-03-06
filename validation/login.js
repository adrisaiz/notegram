const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateLoginInput(data) {
    let errors = {};
 
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    
 
   

    if (!Validator.isEmail(data.email)){
        errors.email = 'Email field is invalid'
    }

    if (Validator.isEmpty(data.email)){
        errors.email = 'Email field is required'
    }

    if (Validator.isEmpty(data.password)){
        errors.password = 'Password field is required'
    }

    if (!Validator.isLength(data.password, 6, 30)){
        errors.password = 'Password field must be between 6 and 30 chars'
    }


    return {
        errors,
        isValid: isEmpty(errors)
    }
}
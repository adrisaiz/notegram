const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateTagInput(data) {
    let errors = {};
 
    data.text = !isEmpty(data.text) ? data.text : '';
    
    if (!Validator.isLength(data.text, 2, 50)){
        errors.password = 'Tag field must be between 10 and 300 chars'
    }

    if (Validator.isEmpty(data.text)){
        errors.email = 'Tag field is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
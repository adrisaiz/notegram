const Validator = require('validator');
const isEmpty = require('./is_empty');

module.exports = function validateNoteInput(data) {
    let errors = {};
 
    data.text = !isEmpty(data.text) ? data.text : '';
    
    if (!Validator.isLength(data.text, 10, 300)){
        errors.password = 'Text field must be between 10 and 300 chars'
    }

    if (Validator.isEmpty(data.text)){
        errors.email = 'Text field is required'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
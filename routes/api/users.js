const express = require('express');
const router = express.Router();
const bCrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../../config/keys');

const User = require('../../models/User');

const ValidateRegisterInput = require('../../validation/register');
const ValidateLoginInput = require('../../validation/login')

router.get('/test', (req,res)=>res.json({msg: "Users works"}));

router.post('/register', (req,res) => {
    const {errors, isValid} = ValidateRegisterInput(req.body);
    
    if (!isValid) {
        return res.status(400,errors);
    }
    User.findOne({email: req.body.email })
    .then(user => {
        if (user){
            errors.email = 'Email already exists';
            return res.status(400).json(errors);
        } else {
            const newUser = new User({name: req.body.name, email: req.body.email, password: req.body.password});
            bCrypt.genSalt(10, (error, salt) => {
                bCrypt.hash(newUser.password, salt, (error, hash) => {
                    if (error) throw error;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(error => console.log(error));
                });
            });
        }

    })
    .catch((error)=> console.log(error));
});

router.post('/login', (req, res) => { 
    const email = req.body.email;
    const password = req.body.password;
    const {errors, isValid} = ValidateLoginInput(req.body);
    User.findOne({email: email}).
    then((user)=> { 
        if (!user) {
            errors.email = 'User email not found';
            return res.status(404).json(errors);
        }
        bCrypt.compare(password, user.password)
        .then((isMatch)=>{
            if (isMatch){
                const payload = {id: user.id, name: user.name};
                jwt.sign(
                    payload,
                    config.secretOrKey, 
                    {expiresIn: 3600}, (err, token)=>{
                        res.json({
                            success: true,
                            token: 'Bearer '+ token
                        })
                });
            } else {
                errors.password = 'Password incorrect';
                return res.status(400).json(errors);
            }
        })
    })
})

router.get('/current', passport.authenticate('jwt', {session: false}) ,(req, res)=>{
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
})

module.exports = router;

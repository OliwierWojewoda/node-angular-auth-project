const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async(req,res,next) => {
    const errors = validationResult(req);   
    if(!errors.isEmpty()) return;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try{
        const hashedPassword = await bcrypt.hash(password, 8)
        const userDetails = {
            name: name,
            email: email,
            password: hashedPassword,
        }
        await User.save(userDetails);
        res.status(201).json({message:'User registered'})
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}
exports.signin = async(req,res,next) => {
    try{
        const user = await User.find(req.body.email) 
        if(user[0].length !== 1){
            const error = new Error('Email not found');
            error.statusCode = 401;
            throw error;
        }
        const storedUser = user[0][0];
        const isEqual = await bcrypt.compare(req.body.password,storedUser.password)
        if(!isEqual){
            const error = new Error('Wrong password');
            error.statusCode = 401;
            throw error; 
        }

        const token = jwt.sign({
            email: storedUser.email,
            userId: storedUser.id     
        },
        'secretfortoken',
        {expiresIn: '1h'})

        res.status(200).json({token: token,userId: storedUser.id})
       
    }
    catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}
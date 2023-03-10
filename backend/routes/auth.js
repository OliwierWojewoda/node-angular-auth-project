const express = require('express');

const { body } = require('express-validator');

const router = express.Router();

const User = require('../models/user');

const authController = require('../controllers/auth');

router.post(
    '/signup',[
       body('name').trim().not().isEmpty(),
       body('email').isEmail().withMessage('Please enter correct email.')
       .custom(async (email)=> {
        const user = await User.find(email);
        if(user[0].length > 0){
            return Promise.reject('Email already exist');
        }
       })
       .normalizeEmail(),
       body('password').trim().not().isEmpty(),
    ],authController.signup
);
router.post(
    '/signin', authController.signin
)



module.exports = router;

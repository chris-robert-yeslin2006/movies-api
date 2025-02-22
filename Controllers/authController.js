const User = require('../models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const customError = require('../utils/customError');   

const signToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_STR, {
        expiresIn: process.env.LOGIN_EXPIRES,
    });
}

exports.signup = asyncErrorHandler(async (req, res, next) => {
        const newUser = await User.create(req.body);

        // const token = jwt.sign({ id: newUser._id }, process.env.SECRET_STR, {
        //     expiresIn: process.env.LOGIN_EXPIRES,
        // });
        const token = signToken(newUser._id);

        res.status(200).json({
            status:"success",
            token,
            message:"User created successfully",
            data:newUser
        })

});

exports.login = asyncErrorHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        const error = new customError('Please provide email and password', 400);
        return next(error);
    }

    const user = await User.findOne({ email }).select('+password');
    // const isMatch = await user.comparePasswordDB(password, user.password);
    if (!user || !(await user.comparePasswordDB(password, user.password))) {
        const error = new customError('Invalid email or password', 401);
        return next(error);
    }

    const token = signToken(user._id);
    res.status(200).json({
        status:"success",
        message:"User logged in successfully",
        token,
        // data:user
        
    })
    });

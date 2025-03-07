const User = require('../Models/userModel');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const customError = require('../utils/customError');  
const util=require('util'); 
const sendEmail=require('./../utils/email');

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
        // console.log(token);
        // console.log('Secret Key:', process.env.SECRET_STR);


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
    console.log(token);
    console.log('Secret Key:', process.env.SECRET_STR);

    res.status(200).json({
        status:"success",
        message:"User logged in successfully",
        token,

        // data:user
        
    })
    });

    exports.protect = asyncErrorHandler(async (req, res, next) => {
        // Get the token from the authorization header
        const testToken = req.headers.authorization;
        let token;
        if (testToken && testToken.split(' ')[0] === 'Bearer') {
            token = testToken.split(' ')[1];
        }

        // If no token is provided, return an error
        if (!token) {
            const error = new customError('You are not logged in', 401);
            return next(error);
        }


        // Verify the token
        const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
        console.log(decodedToken);

        // Check if the user still exists
        const user = await User.findById(decodedToken.id);
        if (!user) {
            const error = new customError('User does not exist', 401);
            return next(error);
        }

        // Check if the user changed their password after the token was issued
        const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
        if (isPasswordChanged) {
            const error = new customError('Password has been changed', 401);
            return next(error);
        }
        req.user = user;
        // Grant access to the protected route
        next();
    });

    exports.restrict=(role)=>{
        return (req,res,next)=>{
            if(req.user.role!==role){
                const error=new customError('You do not have permission to perform this action',403);
                return next(error);
            }
            next();
        
    }};

    exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(new customError("No user found with that email", 404));

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Click the link to reset your password: \n\n ${resetURL}`;

    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset Token",
            message,
        });

        res.status(200).json({
            status: "success",
            message: "Password reset email sent successfully",
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new customError("Error sending email", 500));
    }
});
    exports.resetPassword=asyncErrorHandler(async(req,res,next)=>{
        const user=await User   }); 

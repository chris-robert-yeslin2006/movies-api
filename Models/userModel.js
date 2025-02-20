const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        unique:true,
        trim:true,},
    email:{
        type:String,
        required:[true,'Email is required'],
        unique:true,
        trim:true,
        lowercase:true,
        validate:{validator:validator.isEmail,message:'Email is invalid'}
    },
    password:{
        type:String,
        required:[true,'Password is required'],
        minlength:8,
        trim:true,
    },
    confirmPassword:{
        type:String,
        required:[true,'Confirm password is required'],
        minlength:8,
        trim:true,
    },
    photo:String,


});

const user=mongoose.Model('user',userSchema);

module.exports=user;
const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
// const { validate } = require('./movieModel');

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
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,'Confirm password is required'],
        minlength:8,
        trim:true,
        validate:{validator:function(value){
            if(value===this.password){
                return true;
            }
            else{
                throw new Error('Passwords do not match');
            }
        },message:'Passwords do not match'}
    },
    photo:String,


});
userSchema.pre('save', async function(next){
    if(!(this.isModified('password'))){
        return next();
    }

    this.password=await bcrypt.hash(this.password,10);
    this.confirmPassword=undefined;
    next();

});

userSchema.methods.comparePasswordDB=async function(pswd,pswdDB){
    return await bcrypt.compare(pswd,pswdDB);
};



const user=mongoose.model('user',userSchema);

module.exports=user;
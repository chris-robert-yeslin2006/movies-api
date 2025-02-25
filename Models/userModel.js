const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
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
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'  
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
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,


});
userSchema.pre('save', async function(next){
    if(!(this.isModified('password'))){
        return next();
    }

    this.password=await bcrypt.hash(this.password,10);
    this.confirmPassword=undefined;
    next();

});
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000;
    console.log(resetToken);
    console.log(this.passwordResetToken);
    return resetToken;
}

userSchema.methods.comparePasswordDB=async function(pswd,pswdDB){
    return await bcrypt.compare(pswd,pswdDB);
};
userSchema.methods.isPasswordChanged= async function(jwtTimeStamp){
    if(this.passwordChangedAt){
        const pswdChangedTimeStamp=parseInt(this.passwordChangedAt.getTime() / 1000,10);
    console.log(jwtTimeStamp);
    console.log(this.passwordChangedAt);
    console.log(pswdChangedTimeStamp);
    return jwtTimeStamp>pswdChangedTimeStamp;
    }
    return false;
}


const user=mongoose.model('user',userSchema);

module.exports=user;
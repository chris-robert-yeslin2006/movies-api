const mongoose=require('mongoose');
const fs=require('fs');
const e = require('express');

// const mongoose=require('mongoose');



const movieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        unique:true,
        trim:true,},
    description:{
        type:String,
        required:[true,'description is required'],
    },
    duration:{
        type:Number,
        required:[true,'Duration is required']},
    ratings:{
        type:Number,
        default:1.0,
    },
    totalRatings:{
        type:Number,

    },
    releaseYear:{
        type:Date,
        required:[true,'Release year is required'],

    },
    releaseDate:{
        type:Date,

    },
    genres:{
        type:[String],
        required:[true,'Genre is required'],

    },
    createdAt:{
        type:Date,
        default:Date.now,
        select:false,
    },
    createdBy:{
        type:String,
    },
    directors:{
        type:[String],
        required:[true,'Director is required'],

    },coverImage:{
        type:String,
        required:[true,'Cover image is required'],

    },
    actors:{
        type:[String],
        required:[true,'Actors is required'],
    },
    price:{
        type:Number,
        required:[true,'Price is required'],
    }

},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

movieSchema.virtual('durationInHours').get(function(){
    return this.duration/60;
});
movieSchema.pre('save', function(next) {
    this.createdBy = "robert";
    next();
});
movieSchema.pre(/^find/, function(next) {
    this.find({releaseYear:{$lte:Date.now()}});
    this.startTime=Date.now();
    next();
});

movieSchema.post('save', function(doc, next) {
    const content=`a new movie has been added with the name ${doc.name} created by ${doc.createdBy}\n`;
    fs.writeFileSync('./log/log.txt',content,{flag:'a'},(err)=>{
        if(err){
            console.log(err.message);
        }
    });

    next();
});
movieSchema.post(/^find/, function(docs, next) {
    this.find({releaseDate:{$gte:Date.now()}});
    this.endTime=Date.now();
    const content=`query took ${this.endTime-this.startTime}ms\n`;
    fs.writeFileSync('./log/log.txt',content,{flag:'a'},(err)=>{
        if(err){
            console.log(err.message);
        }
    });
    next();
});

const Movie=mongoose.model('Movie',movieSchema);
module.exports=Movie;


// Sample JSON data for the movie schema:

/*

*/


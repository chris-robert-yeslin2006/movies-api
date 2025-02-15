const mongoose=require('mongoose');


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
})

const Movie=mongoose.model('Movie',movieSchema);
module.exports=Movie;


// Sample JSON data for the movie schema:

/*

*/


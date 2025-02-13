const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs= require('fs');
const Movie=require('./../Models/movieModels');

dotenv.config({path:'./config.env'});

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    // console.log(conn);
    console.log('successfully connected to db');
}).catch((err) => {
    console.error('Error connecting to the database', err);
});

const movies=JSON.parse(fs.readFileSync('./data/movies.json','utf-8'));

const deleteMovies=async()=>{  
    try{  
    await Movie.deleteMany({});
    console.log('deleted all movies');
    }
    catch(err){
        console.error('Error deleting all movies',err.message);
    }
    process.exit();
}
const importMovies=async()=>{
    try{
        await Movie.create(movies);
        console.log('successfully imported movies');
    }
    catch(err){
        console.error('Error creating movies',err.message);
    }process.exit();
}
console.log(process.argv);
if(process.argv[2]==='--delete'){
    deleteMovies();
}
else if(process.argv[2]==='--import'){
    importMovies();
}

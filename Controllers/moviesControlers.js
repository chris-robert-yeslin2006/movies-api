// const fs = require('fs');
const Movie=require('./../Models/movieModels');

// const movies = JSON.parse(fs.readFileSync('movies.json', 'utf8'));

// exports.checkId=(req,res,next,value)=>{
//     console.log('value id:'+value);
//     let movie = movies.find(el => el.id === value*1);
//     if (!movie) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'No movie found with that ID:' + value
//         });
//     }
//     next();
// }

// exports.validateBody=(req,res,next)=>{
//     if(!req.body.moviename || !req.body.releaseyear){
//         return res.status(400).json({
//             status:'fail',
//             message:'not a valid movie details'
//         });
//     }
//     next();
// }

// exports.getAllMovies= (req, res) => {
//     // res.status(200).json(
//     //     {
//     //         status: 'success',
//     //         count: movies.length,
//     //         requestTime:req.requestAtTime,
//     //         data: {
//     //             movies: movies
//     //         }
//     //     }
//     // );
// }

// exports.createMovie=(req, res) => {
//     // const newID = movies[movies.length - 1].id + 1;
//     // const newMovie = Object.assign({ id: newID }, req.body);
//     // movies.push(newMovie);
//     // fs.writeFile('movies.json', JSON.stringify(movies), (err) => {
//     //     res.status(201).json({
//     //         status: 'success',
//     //         data: { 
//     //             movie: newMovie }
//     //     });
//     // });
// }


// exports.getMovieById=(req, res) => {
//     // console.log(req.params);
//     // let movie = movies.find(el => el.id === req.params.id*1);
//     // if (!movie) {
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: 'No movie found with that ID'
//     //     });
//     // }
//     // res.status(200).json({
//     //     status: 'success',
//     //     data: {
//     //         movie: movie
//     //     }
//     // });
// }

// exports.updateMovie=(req, res) => {
//     // let movie = movies.find(el => el.id === req.params.id*1);
//     // if (!movie) {
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: 'No movie found with that ID'  
//     //     });
//     // }
//     // let index = movies.indexOf(movie);
//     // let updatedMovie = Object.assign(movie, req.body);
//     // movies[index] = updatedMovie;
//     // fs.writeFile('movies.json', JSON.stringify(movies), (err) => {
//     //     res.status(200).json({
//     //         status: 'success',
//     //         data: {
//     //             movie: updatedMovie
//     //         }
//     //     });
//     // }); 
    
    
// }

// exports.deleteMovie=(req,res)=>{
//     // const id =req.params.id*1;
//     // let movietodelete=movies.find(el=> el.id===id);
//     // // if (!movietodelete) {
//     //     return res.status(404).json({
//     //         status: 'fail',
//     //         message: 'No movie found with that ID'  
//     //     });
//     // }
//     // let index=movies.indexOf(movietodelete);
//     // movies.splice(index,1);
//     // fs.writeFile('movies.json', JSON.stringify(movies), (err) => {
//     //     res.status(204).json({
//     //         status: 'success',
//     //         data: {
//     //             movie: null
//     //         }
//     //     });
//     // });

// }
exports.getAllMovies= async(req,res)=>{
    try{
        const movies=await Movie.find();
        res.status(200).json({
            status:'success',
            length: movies.length,
            data:{
                movies
            }
        });
    }catch(err){
        res.status(404).json({
            status:'fail',
            message:err.message
        });
    }
}
exports.createMovie= async(req,res)=>{
    // const testMovie = new movie({});
    // testMovie.save()
    try{
        const movie=await Movie.create(req.body);
        res.status(201).json({
            status:'success',
            data:{
                movie
            }
        });
    }catch(err){
        res.status(400).json({
            status:'fail',
            message:err.message
        });
    }

}
exports.getMovieById=async(req,res)=>{
    try{
        const movie=await Movie.findById(req.params.id);    
        res.status(200).json({
            status:'success',
            data:{
                movie
            }
        });
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err.message });
        }
}
exports.updateMovie=async(req,res)=>{
    try{
        const movie=await Movie.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        res.status(200).json({
            status:'success',
            data:{
                movie
            }
        });
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err.message
        });
    }
};
exports.deleteMovie=async(req,res)=>{
    try{
        const movie=await Movie.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status:'success',
            data:{
                movie
            }
        });
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err.message
        });
    }
};  
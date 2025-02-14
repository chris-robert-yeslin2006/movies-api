// const {params}=require('../routes/moviesRoutes');
const Movie = require('./../Models/movieModels');

// exports.getAllMovies = async (req, res) => {
//     console.log(req.query);

//     try {
//         console.log(req.query);

//         const movies = await Movie.find(req.query);
//         if (!movies || movies.length === 0) {
//             return res.status(404).json({
//                 status: 'fail',
//                 message: 'No movies found'
//             });
//         }
//         res.status(200).json({
//             status: 'success',
//             length: movies.length,
//             data: {
//                 movies: movies
//             }
//         });
//     } catch (err) {
//         console.error('Error fetching movies:', err.message);
//         res.status(500).json({
//             status: 'fail',
//             message: 'Error fetching movies'
//         });
//     }
// };

// const Movie = require('../models/movieModels'); // Ensure correct path

exports.getAllMovies = async (req, res) => {
    try {
        // console.log(req.query);
        let  queryStr=JSON.stringify(req.query);
        // console.log(queryStr);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        const objStr=JSON.parse(queryStr);
        // console.log(objStr);
        const movie = await Movie.find(objStr);
        // const movie=await Movie.find()
        //                         .where('duration').gte(req.query.duration)
        //                         .where('ratings').gte(req.query.ratings)
                                
        //                         .where('price').gte(req.query.price)
                                
        if (!movie) {
            return res.status(404).json({
                status: 'fail',
                message: 'No movie found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            length:movie.length,
            data: {
                movie
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.createMovie = async (req, res) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.getMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) {
            return res.status(404).json({
                status: 'fail',
                message: 'No movie found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!movie) {
            return res.status(404).json({
                status: 'fail',
                message: 'No movie found with that ID'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);
        if (!movie) {
            return res.status(404).json({
                status: 'fail',
                message: 'No movie found with that ID'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        });
    }
};
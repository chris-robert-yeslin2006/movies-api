const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
const Movie = require('../Models/movieModels'); // Ensure correct path
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const customError = require('../utils/customError');

exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    const objStr = JSON.parse(queryStr);
    
    let query = Movie.find(objStr);
    query = query.select('-__v');

    const movies = await query;

    if (!movies || movies.length === 0) {
        return next(new customError('No movies found', 404));
    }

    res.status(200).json({
        status: 'success',
        length: movies.length,
        data: { movies }
    });
});

exports.createMovie = asyncErrorHandler(async (req, res) => {
    const movie = await Movie.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { movie }
    });
});

exports.getMovieById = asyncErrorHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new customError('Invalid movie ID format', 400));
    }

    const movie = await Movie.findById(req.params.id);
    if (!movie) {
        return next(new customError('No movie found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { movie }
    });
});

exports.updateMovie = asyncErrorHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new customError('Invalid movie ID format', 400));
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!movie) {
        return next(new customError('No movie found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { movie }
    });
});

exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new customError('Invalid movie ID format', 400));
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
        return next(new customError('No movie found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
    const stats = await Movie.aggregate([
        { $match: { ratings: { $gte: 1 } } },
        { 
            $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$ratings' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price' },
                movieCount: { $sum: 1 }
            }
        },
        { $sort: { minPrice: 1 } }
    ]);

    res.status(200).json({
        status: 'success',
        count: stats.length,
        data: { stats }
    });
});

exports.getMovieByGenre = asyncErrorHandler(async (req, res, next) => {
    const genre = req.params.genre;
    const movies = await Movie.aggregate([
        { $unwind: "$genres" },
        { 
            $group: {
                _id: "$genres",
                count: { $sum: 1 },
                movies: { $push: "$name" }
            }
        },
        { $addFields: { "genre": "$_id" } },
        { $project: { _id: 0 } },
        { $sort: { count: -1 } },
        { $match: { genre: genre } }
    ]);

    res.status(200).json({
        status: "success",
        length: movies.length,
        data: { movies }
    });
});

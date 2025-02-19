const Movie = require('./../Models/movieModels');
const asyncErrorHandler=require('./../utils/asyncErrorHandler');

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

exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {
    
        // console.log(req.query);
        let  queryStr=JSON.stringify(req.query);
        // console.log(queryStr);
        queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        const objStr=JSON.parse(queryStr);
        // console.log(objStr);
        // delete objStr.fields;
        // delete objStr.sort;
        let query=  Movie.find(objStr);
                                    // const movie=await Movie.find()
                                    //                         .where('duration').gte(req.query.duration)
                                    //                         .where('ratings').gte(req.query.ratings)
                                                            
                                    //                         .where('price').gte(req.query.price)
        
                                    
        //limiting feilds
        // if(req.query.fields){
        //     console.log(req.query.fields);
        //     const feilds=req.query.fields.split(',').join(' ');
        //     query=query.select(feilds);
        // }
        
        query=query.select('-__v');
        const movie = await query;
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
    
});



exports.createMovie =asyncErrorHandler( async (req, res) => {
    
        const movie = await Movie.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        });
    
})

exports.getMovieById = asyncErrorHandler( async (req, res, next) => {
    
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
    
});

exports.updateMovie = asyncErrorHandler( async (req, res, next) => {    
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
    
});

exports.deleteMovie = asyncErrorHandler( async (req, res, next) => {
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
    
});

exports.getMovieStats = asyncErrorHandler( async (req, res, next) => {  
        const stats = await Movie.aggregate([
            { $match: {ratings: {$gte: 1}}},
            { $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$ratings'},
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price'},
                movieCount: { $sum: 1}
            }},
            { $sort: { minPrice: 1}}
            //{ $match: {maxPrice: {$gte: 60}}}
        ]);

        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        });
    
});
exports.getMovieByGenre=asyncErrorHandler( async (req, res, next) => {
        const genre=req.params.genre;
        const movies=await Movie.aggregate([
            {$unwind:"$genres"},
            {$group:{
                _id:"$genres",
                count:{$sum:1},
                m:{$push:"$name"},
            }},
            {$addFields:{"genre":"$_id"}},
            {$project:{_id:0}},
            {$sort:{count:-1}},
            // {$limit:10},
            {$match:{genre:genre}},
            
        ])    
            
    
        res.status(200).json({
            status:"success",
            length:movies.length,
            data:{
                movies
            }
        });
    
});
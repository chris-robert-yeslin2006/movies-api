const express=require('express');
const moviesController=require('./../Controllers/moviesControlers');
const authController=require('./../Controllers/authController');


const router=express.Router();
// router.param('id',moviesController.checkId)
router.route('/movie-stats').get(moviesController.getMovieStats);
router.route('/movie-genre/:genre').get(moviesController.getMovieByGenre);
router.route('')
    .get(authController.protect , moviesController.getAllMovies)
    .post(moviesController.createMovie);

router.route('/:id')
    .get(authController.protect , moviesController.getMovieById)
    .patch(moviesController.updateMovie)
    .delete(authController.protect ,authController.restrict('admin') ,moviesController.deleteMovie);

module.exports=router;
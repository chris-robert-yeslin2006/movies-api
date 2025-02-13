const express=require('express');
const moviesController=require('./../Controllers/moviesControlers');


const router=express.Router();
// router.param('id',moviesController.checkId)
router.route('')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie);

router.route('/:id')
    .get(moviesController.getMovieById)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie);

module.exports=router;
//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');
const customError = require('./utils/customError');
const errorController = require('./Controllers/errorController');
const e = require('express');
let app = express();

app.use(express.json());

app.use(express.static('./public'))

//USING ROUTES
app.use('/api/v1/movies', moviesRouter);
app.get('*',(req,res) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: 'Invalid URL'
    // });
    // const err=new Error('Invalid URL');
    // err.statusCode=404;
    // err.status='fail';
    const err=new customError('Invalid URL',404);
    next(err);

});

app.use(errorController);

module.exports = app;


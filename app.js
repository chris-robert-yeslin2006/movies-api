//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');

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
    const err=new Error('Invalid URL');
    err.statusCode=404;
    err.status='fail';
    next(err);

});

app.use((error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message
    });
});

module.exports = app;


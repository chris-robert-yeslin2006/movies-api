const express = require('express');
const morgan=require('morgan');
const movieRoute=require('./routes/moviesRoutes');
let app = express();



app.use(express.json());
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'));

}
app.use(express.static('./public'))
app.use((req,res,next)=>{
    

    req.requestAtTime=new Date().toISOString();
    next();

})





app.use('/api/v1/movies',movieRoute);
module.exports=app;


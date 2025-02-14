const dotenv=require('dotenv');
const mongoose=require('mongoose');
dotenv.config({
    path:'./config.env'
})

const app=require('./app');
// console.log(process.env); 
mongoose.connect(process.env.CONN_STR, {
    // useNewUrlParser: true
}).then((conn) => {
    // console.log(conn);
    console.log('successfully connected to db');
}).catch((err) => {
    console.error('Error connecting to the database', err);
});






const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
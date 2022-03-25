const mongoose = require( 'mongoose' );
// const url = process.env.DATABASE_URI.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const url = 'mongodb://localhost/ElectionDB'
mongoose.connect(url)
    .then( () => {
    console.log('Database successfully connected.')
    } ).catch( (error) => {
        console.log(error.message)
    })

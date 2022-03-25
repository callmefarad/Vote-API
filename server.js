require( 'dotenv' ).config();
require( './utils/dbConnection' );
const express = require( 'express' );
const port = process.env.PORT || 2022;
const userRoute = require('./router/userRoute')
const presidentRoute = require('./router/presidentRoute')
const secretaryRoute = require('./router/secretaryRoute')

const app = express();
app.use(express.json())

app.get( '/', ( req, res ) => {
    res.status( 200 ).json( {
        status: 'success',
        message: 'Welcome To CodeLab Vote API'
    } )
} )

app.use('/api', userRoute)
app.use('/api/president', presidentRoute)
app.use('/api/secretary', secretaryRoute)


app.listen( port, () => {
    console.log(`Server is listening to port ${port}`);
})
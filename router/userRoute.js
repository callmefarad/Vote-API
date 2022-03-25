const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );
const bcrypt = require( 'bcrypt' );
const imageUploader = require( '../utils/multer' );
const cloudinary = require( '../utils/cloudinary' );
const userModel = require('../model/userModel');


const router = express.Router();

// GET ALL VOTERS
router.get( '/voters', async ( req, res ) => {
    try {
        const voters = await userModel.find();
        res.status( 200 ).json( {
            status: 'success',
            voters: {
                voters
            }
        })
    } catch (error){
        res.status( 404 ).json( {
            status: 'fail',
            message: `Error caused by ${error.message}`
        })
    }
} )


// CREATE A VOTER
router.post( '/voter/register', imageUploader, async ( req, res ) => {
    try {
        const { name, email, password } = req.body;
        const salt = await bcrypt.genSalt( 10 );
        const hash = await bcrypt.hash( password, salt )
        
        const image = cloudinary.uploader.upload( req.file.path )
        const createUser = await userModel.create( {
            name,
            email,
            password: hash,
            avatar: image.secure_url
        } )
        res.status( 201 ).json( {
            status: 'success',
            data: {
                user: createUser
            }
        })
    } catch (error){
        res.status( 404 ).json( {
            status: 'fail',
            message: `Error caused by ${error.message}`
        })
    }
} )

// GET SINGLE VOTER
router.get( '/voter/:id', async ( req, res ) => {
    try {
        const voter = await userModel.findById( req.params.id );
        if ( !voter ) {
            res.status( 404 ).json( {
                status: 'fail',
                message: `User with id ${req.params.id} is not found.`
            })
        } else {
            res.status( 200 ).json( {
            status: 'success',
            voters: {
                voter
            }
        })
        } 
    } catch (error){
        res.status( 404 ).json( {
            status: 'fail',
            message: `Error caused by ${error.message}`
        })
    }
} )

// UPDATE A VOTER
router.get( '/voter/:id', imageUploader,  async ( req, res ) => {
    try {
        const id = req.params.id;
        if ( !id ) {
            res.status( 404 ).json( {
                status: 'fail',
                message: `User with id ${req.params.id} is not found.`
            })
        } else {
            const { name } = req.body;
            const image = await cloudinary.uploader.upload(req.file.path)
            const updatedUser = await userModel.findByIdAndUpdate(
                id,
                {
                    name,
                    avatar: image.secure_url
                }, { new: true } )
            res.status( 200 ).json( {
                status: 'success',
                updated: {
                    updatedUser
                }
            })
        } 
    } catch (error){
        res.status( 404 ).json( {
            status: 'fail',
            message: `Error caused by ${error.message}`
        })
    }
} )

// SIGNIN
router.post( '/voter/signin', async ( req, res ) => {
    try {
        const { email, password } = req.body;
        const checkEmail = await userModel.findOne( { email } )
        if ( checkEmail ) {
            const checkPassword = await bcrypt.compare( password, checkEmail.password );

            if ( checkPassword ) {
                const token = jwt.sign( {
                    _id: checkEmail._id,
                    name: checkEmail.name,
                    isAdmin: checkEmail.isAdmin,
                    email: checkEmail.email
                },
                    'anythingcangohere12345',
                    { expiresIn: '3d' }
                )
                const { password, ...info } = checkEmail._doc;
                res.status( 201 ).json( {
                    status: 'success',
                    data: {
                        ...info, token
                    }
                })
            } else {
                res.status( 400 ).json( {
                    status: 'fail',
                    message: 'Wrong Password'
                })
            }
        }
    } catch (error){
        res.status( 404 ).json( {
            status: 'fail',
            message: `Error caused by ${error.message}`
        })
    }
} )


module.exports = router;
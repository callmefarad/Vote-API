const express = require( 'express' );
const jwt = require( 'jsonwebtoken' );
const imageUploader = require( '../utils/multer' );
const cloudinary = require( '../utils/cloudinary' );
const secretaryModel = require( '../model/secretaryModel' );

const router = express.Router();

// VERIFY IF A USER IS ADMIN
const verify = (req, res, next) => {
    const authToken = req.headers.authorization

    if ( authToken ) {
        const token = authToken.split( " " )[ 1 ]
        
        jwt.verify( token, 'anythingcangohere12345', ( err, payload ) => {
            if ( err ) {
                res.status( 400 ).json( {
                    status: 'fail',
                    message: 'Token is not valid'
                } )
            } else {
                req.user = payload
                next();
            }
        } );
    }
}


// GET ALL SECRETARY CANDIDATES
router.get( '/candidates', async ( req, res ) => {
    try {
        const candidates = await secretaryModel.find();
        res.status( 200 ).json( {
            status: 'success',
            candidate: {
                candidates
            }
        })
    } catch ( error ) {
        res.status( 404 ).json( {
            status: 'fail',
            message: error.message
        })
    }
} )

// GET ONE SECRETARY CANDIDATE
router.get( '/candidates/:id', async ( req, res ) => {
    try {
        const candidate = await secretaryModel.findById( req.params.id )
        res.status( 200 ).json( {
            status: 'success',
            data: {
                candidate
            }
        })
    } catch ( error ) {
            res.status( 404 ).json( {
            status: 'fail',
            message: error.message
        })
    }
})

// CREATE A SECRETARY CANDIDATE
router.post( '/candidate/create', verify, imageUploader, async ( req, res ) => {
    try {
        if (req.user.isAdmin) {
            const { name, voteCount } = req.body;
            const image = await cloudinary.uploader.upload( req.file.path );
            const createCandidate = await secretaryModel.create( {
                name,
                voteCount,
                avatar: image.secure_url
            } )
            res.status( 201 ).json( {
                status: 'success',
                data: {
                    createCandidate
                }
            })
        } else {
            res.status( 400 ).json( {
                status: 'fail',
                message: 'No access granted'
            })
        }
    } catch (error){
        res.status( 404 ).json( {
            status: 'fail',
            message: `Error caused by ${error.message}`
        })
    }
} )

// CAST A VOTE FOR A SECRETARY
router.post( '/candidate/:id', async ( req, res ) => {
    try {
        const voteCount = {
            who: req.body.who,
            toggle: true
        };

        const createCandidate = await secretaryModel.findByIdAndUpdate(
            req.params.id, 
            {
                $push: { voteCount }
            },
            { new: true }
        )
        
        res.status( 201 ).json( {
            status: 'success',
            data: {
                createCandidate
            }
        })
    } catch ( error ) {
            res.status( 404 ).json( {
            status: 'fail',
            message: `Error caused by ${error.message}`
        })
    }
} )


// DELETE A CASTED VOTE
router.delete( '/candidate/:id/:voteID', async ( req, res ) => {
    try {
        const createCandidate = await secretaryModel.findByIdAndUpdate(
            req.params.id, 
            {
                $pull: { voteCount: {_id: req.params.voteID} }
            },
            { new: true }
        )
        
        res.status( 204 ).json( {
            status: 'success',
            data: {
                createCandidate
            }
        })
    } catch ( error ) {
            res.status( 404 ).json( {
            status: 'fail',
            message: `Error caused by ${error.message}`
        })
    }
})



module.exports = router
const mongoose = require( 'mongoose' );

const vote = mongoose.Schema( {
    who: {
        type: String
    },
    toggle: {
        type: Boolean
    }
})


const presidentSchema = mongoose.Schema( {
    name: {
        type: String
    },
    position: {
        type: String,
        default: "President"
    },
    avatar: {
        type: String
    },
    voteCount: [vote]
},{timestamps: true} )

const presidentModel = mongoose.model( 'president', presidentSchema )

module.exports = presidentModel;
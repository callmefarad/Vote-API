const mongoose = require( 'mongoose' );

const vote = mongoose.Schema( {
    who: {
        type: String
    },
    toggle: {
        type: Boolean
    }
})

const secretarySchema = mongoose.Schema( {
    name: {
        type: String
    },
    position: {
        type: String,
        default: "Secretary"
    },
    avatar: {
        type: String
    },
    voteCount: [vote]
},{timestamps: true} )

const secretaryModel = mongoose.model( 'secretary', secretarySchema )

module.exports = secretaryModel;
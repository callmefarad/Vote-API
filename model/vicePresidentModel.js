const mongoose = require( 'mongoose' );

const vote = mongoose.Schema( {
    who: {
        type: String
    },
    toggle: {
        type: Boolean
    }
})


const vicePresidentSchema = mongoose.Schema( {
    name: {
        type: String
    },
    position: {
        type: String,
        default: "Vice President"
    },
    avatar: {
        type: String
    },
    voteCount: [vote]
},{timestamps: true} )

const vicePresidentModel = mongoose.model( 'vicePresident', vicePresidentSchema )

module.exports = vicePresidentModel;
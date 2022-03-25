const mongoose = require( 'mongoose' );

const userSchema = mongoose.Schema( {
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    isAdmin: {
        type: String,
        default: false
    },
    avatar: {
        type: String
    }
},{timestamps: true} )

const userModel = mongoose.model( 'user', userSchema )

module.exports = userModel;
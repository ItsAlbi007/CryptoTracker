/////////////////////////////////////
//// Our Schema and dependencies ////
/////////////////////////////////////
const mongoose = require('../utils/connection')

// destructuring the Schema and model from mongoose
const { Schema, model } = mongoose



//// Schema definition ////

const watchlistSchema = new Schema({
    base:{
        type: String,
        required: true
    },
    volume: {
        type: String,
        required: true
    },
    coinId: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})



//// create user model ////

const Watchlist = model('Watchlist', watchlistSchema)


//// export user model ////

module.exports = Watchlist
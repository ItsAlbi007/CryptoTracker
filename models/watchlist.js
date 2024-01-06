/////////////////////////////////////
//// Our Schema and dependencies ////
/////////////////////////////////////
const mongoose = require('../utils/connection')

// destructuring the Schema and model from mongoose
const { Schema, model } = mongoose



//// Schema definition ////

const watchlistSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    coinId: {
        type: String,
        required: true
    }
})


//// create user model ////

const Watchlist = model('Watchlist', watchlistSchema)


//// export user model ////

module.exports = Watchlist
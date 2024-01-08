/////////////////////////////////
// Our Schema and dependencies //
/////////////////////////////////
const mongoose = require('../utils/connection')

// destructuring the Schema and model from mongoose
const { Schema, model } = mongoose

// Schema definition //

const watchlistSchema = new Schema({
    coinId: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: false
    },
    currentPrice: {
        type: Number,
        required: true
    },
    nickname: {
        type: String,
        required: false
    }

}, {
    timestamps: true
})

const Watchlist = model('Watchlist', watchlistSchema)

module.exports = Watchlist
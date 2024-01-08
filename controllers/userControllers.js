// Import Dependencies //

const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const Watchlist = require('../models/watchlist')

// Create Router //

const router = express.Router()

//Routes + Controllers //

// GET -> SignUp - /users/signup
router.get('/signup', (req, res) => {
    const { username, loggedIn, userId } = req.session
    res.render('users/signup', { username, loggedIn, userId })
})

// POST -> SignUp - /users/signup
router.post('/signup', async (req, res) => {
    const newUser = req.body

    newUser.password = await bcrypt.hash(
        newUser.password, 
        await bcrypt.genSalt(10)
    )

    User.create(newUser)
        .then(user => {
            res.redirect('/users/login')
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
        })
})

// GET -> Login -> /users/login
router.get('/login', (req, res) => {
    const { username, loggedIn, userId } = req.session
    res.render('users/login', { username, loggedIn, userId })
})

// POST -> Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    User.findOne({ username })
        .then(async (user) => {
            if (user) {
                const result = await bcrypt.compare(password, user.password)

                if (result) {
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id
                    res.redirect('/')
                } else {
                    res.redirect(`/error?error=something%20wrong%20with%20credentials`)
                }
            } else {
                res.redirect(`/error`)
            }
        })
        .catch(err => {
            console.log('error')
            res.redirect(`/error?error=${err}`)
    })
})

// GET -> Logout - /users/logout
router.get('/logout', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/logout', { username, loggedIn, userId })
})

// DELETE -> Logout
router.delete('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

router.get('/main', async (req, res) => {
    const { username, loggedIn, userId } = req.session
    Watchlist.find({owner: userId})
    .then(userWatchlist => {
        res.render('users/main', {watchlist: userWatchlist, username, userId, loggedIn})
    })
    .catch(err => {
        res.redirect(`/error?error=${err}`)
    })
})

router.post('/add', async (req,res) => {
    try{
        const {username, loggedIn, userId} = req.session
        const watchlist = await Watchlist.find({owner: userId, coinId: req.body.coinId})
        if (watchlist.length == 0){
            const newWatchList = {
                owner: userId,
                coinId: req.body.coinId,
                currentPrice: req.body.currentPrice,
                nickname: req.body.nickname
            }
            await Watchlist.create(newWatchList)
            .then(done => {
                res.redirect('/users/main')
            })
        } else {
        res.redirect('/cryptos/all')
        }
    } catch(err) {
        res.redirect(`/error?error=${err}`)
    }
})

router.put('/update/:id', (req, res) => {
    const { username, loggedIn, userId } = req.session

    const watchlistId = req.params.id
    const theUpdatedWatchlist = req.body
    delete theUpdatedWatchlist.owner
    theUpdatedWatchlist.owner = userId

    Watchlist.findById(watchlistId)
        .then(foundWatchlist => {
            if (foundWatchlist.owner == userId) {
                return foundWatchlist.updateOne(theUpdatedWatchlist)
            } else {
                res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Update%20this%20Watchlist`)
            }
        })
        .then(returnedWatchlist => {
            res.redirect(`/users/main`)
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

router.delete('/delete/:id', (req, res) => {
    const { username, loggedIn, userId} = req.session
    const watchlistId = req.params.id
    Watchlist.findById(watchlistId)
    .then(watchlist => {
        if (watchlist.owner == userId) {
            return watchlist.deleteOne()
        } else {
            res.redirect(`/error?error=You%20Are%20Not%20Allowed%20to%20Delete%20this%20watchlist`)
        }
    })
    .then(deletedWatchlist => {
        res.redirect('/users/main')
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})

module.exports = router

//// Import Dependencies ////

const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const Watchlist = require('../models/watchlist')
const { all, default: axios } = require('axios')


//// Create Router ////

const router = express.Router()


//// Routes + Controllers ////

// GET -> SignUp - /users/signup
router.get('/signup', (req, res) => {
    const { username, loggedIn, userId } = req.session

    res.render('users/signup', { username, loggedIn, userId })
})

// POST -> SignUp - /users/signup
// this function will need to be async, bc we need to use bcrypt
router.post('/signup', async (req, res) => {
    // const { username, loggedIn, userId } = req.session

    const newUser = req.body

    // we need to encrypt the password, which is what we will save to the db
    // bcrypt is an encryption service
    // genSalt creates 'salt rounds' -> puts it through 10 rounds of encrypting
    // this makes the stored password harder to hack(de-encrypt)
    newUser.password = await bcrypt.hash(
        newUser.password, 
        await bcrypt.genSalt(10)
    )

    // we can now create our user
    User.create(newUser)
        .then(user => {
            // the new user will be created and redirected to the login page
            res.redirect('/users/login')
        })
        .catch(err => {
            console.log('error')

            // res.send('something went wrong')
            // using our new error page
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
    // const { username, loggedIn, userId } = req.session

    // we can pull our credentials from the req.body
    const { username, password } = req.body

    // search the db for our user
    // since our usernames are unique, we can use that
    User.findOne({ username })
        .then(async (user) => {
            // if the user exists
            if (user) {
                // we compare the password they put in with the one we have stored
                // we can easily do this with bcrypt
                // will send either a truthy or a falsey value
                const result = await bcrypt.compare(password, user.password)

                if (result) {
                    // if the pws match -> log them in and create the session
                    req.session.username = username
                    req.session.loggedIn = true
                    req.session.userId = user.id

                    // once we're logged in, redirect to the home page
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
        console.log('this is userwatch', userWatchlist)
        res.render('users/main', {watchlist: userWatchlist, username, userId, loggedIn})
    })
    .catch(err => {
        console.log('error')
        res.redirect(`/error?error=${err}`)
    })
})

router.post('/add', async (req,res) => {
    try{
        const {username, loggedIn, userId} = req.session
        console.log('this is the user', userId)
        const watchlist = await Watchlist.find({owner: userId, coinId: req.body.coinId})
        console.log('this is the watchlist', watchlist)
        if (watchlist.length == 0){
            console.log('this is the body', req.body)
            const newWatchList = {
                owner: userId,
                coinId: req.body.coinId,
                currentPrice: req.body.currentPrice

            }
            await Watchlist.create(newWatchList)
            .then(done => {
                res.redirect('/cryptos/all')
            })
        } else {
        res.redirect('/cryptos/all')
        }
    } catch(err) {
        console.log(err)
        res.redirect(`/error?error=${err}`)
    }
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


//// Export Router ////

module.exports = router
// Import Dependecies

const express = require('express') //import express framework
const { appendFile } = require('fs')
const path = require('path') // import path module
const middleware = require('./utils/middleware')
const axios = require('axios')
const mongoose = require('mongoose')
const { stringify } = require('querystring')
require('dotenv').config() // import/load ENV variables

// Import Routers




// Define cryptoSchema
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Crypto'}]
})

const User = mongoose.model('User', userSchema)

const cryptoSchema = new mongoose.Schema ({
  name: String,
  symbol: String,
  price: Number,
})

const Crypto = mongoose.model('Crypto', cryptoSchema)



// Create the app object + set up view engine

const app = express() // call the express function

//view engine - ejs

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


// Middleware

middleware(app)
app.set(express.urlencoded({ extended: true}))


// Routes

app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false,
      }
    })

    const cryptoData = response.data.map((crypto) => ({
      name: crypto.name,
      symbol: crypto.symbol,
      price: crypto.current_price,
      marketCap: crypto.market_cap,
    }))
    await Crypto.deleteMany({})
    await Crypto.create(cryptoData)

    const cryptoList = await Crypto.find({})
    res.render('index', { cryptoList, user: req.user})
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
}) 

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.user(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(require('express-session')({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}))

app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', async (req, res) => {
  try {
    const { username, email, password} = req.body
    const user = await User.register(new User({ username, email}), password)
    passport.authenticate('local')(req, res, () => {
      res.redirect('/')
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Internal Server Error')
  }
})

app.get('/logn', (req, res) => {
  res.render('login')
})

app.post('/login', passport.authenticate('local',{
  successRedirect: '/',
  failureRedirect: '/login',
}))

// Server Listener
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('your server is running, better go catch it')
})



// END
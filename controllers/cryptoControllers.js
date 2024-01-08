// Import Dependencies //

const express = require('express')
const axios = require('axios')
const listCoinUrl = process.env.API_BASE_URL
const infoCoinUrl = process.env.COIN_API_URL

// Create Router //

const router = express.Router()


// Routes + Controllers //

router.get('/all', async (req, res) => {
  const { username, loggedIn, userId } = req.session
  axios(listCoinUrl)
    .then(apiRes => {
      let coin = apiRes.data
      res.render('cryptos/index.ejs', { coin, username, loggedIn, userId })
    })
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
  })
})

// GET -> /info/:id
// example: /info/bitcoin, /info/eth
router.get('/info/:id', async (req, res) => {
  const { username, loggedIn, userId } = req.session
  const coinId = req.params.id
  const url = `${infoCoinUrl}${coinId}`
  axios(url)
    .then(apiRes => {
      let coin = apiRes.data
      res.render('cryptos/info', { coin, username, loggedIn, userId })
    })
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
  })
})

module.exports = router
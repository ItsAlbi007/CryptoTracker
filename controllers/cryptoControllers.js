
//// Import Dependencies ////

const express = require('express')
const axios = require('axios')
const listCoinUrl = process.env.API_BASE_URL
const infoCoinUrl = process.env.COIN_API_URL
//const allSearchBaseUrl = process.env.CURRENCIES_API_URL


//// Create Router ////

const router = express.Router()


//// Routes + Controllers ////


// gives us all crypto in the api index
router.get('/all', async (req, res) => {
  const { username, loggedIn, userId } = req.session
  // we have to make out api call
  axios(listCoinUrl)
    .then(apiRes => {
      let coin = apiRes.data
      //console.log(coin)
      //console.log('this came back from api: /n', coin.bitcoin)
      res.render('cryptos/index.ejs', { coin, username, loggedIn, userId })

    })
    // if something goes wrong display an error page
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
  //console.log(url)
  //console.log('print', url)
  axios(url)
    .then(apiRes => {
      let coin = apiRes.data
     // console.log('thiscoin', coin)
      res.render('cryptos/info', { coin, username, loggedIn, userId })
    })
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
  })
})
//give us a specific crypto details


//// Export Router ////

module.exports = router




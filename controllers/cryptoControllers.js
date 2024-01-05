
//// Import Dependencies ////

const express = require('express')
const axios = require('axios')
//const allCoinUrl = process.env.CURRENCIES_API_URL
const listCoinUrl = process.env.API_BASE_URL


//// Create Router ////

const router = express.Router()


//// Routes + Controllers ////

// GET -> /crypto/:name
// gives us all crypto in the api index
router.get('/all', async (req, res) => {
  const { username, loggedIn, userId } = req.session
  // we have to make out api call
  axios(listCoinUrl)
    .then(apiRes => {
      let coin = apiRes.data
      console.log(coin)
      console.log('this came back from api: /n', coin.bitcoin)
      res.render('cryptos/index.ejs', { coin, username, loggedIn, userId })

    })
    // if something goes wrong display an error page
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
  })
})

//give us a specific crypto details



//// Export Router ////

module.exports = router

//bitcoin,ethereum,tether,cardano,solana,dogecoin,polkadot,polygon,tron,avalanche,litecoin,stellar,
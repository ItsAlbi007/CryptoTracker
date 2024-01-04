/////////////////////////////
//// Import Dependencies ////
/////////////////////////////
const express = require('express')
const axios = require('axios')
const allCoinUrl = process.env.CURRENCIES_API_URL


///////////////////////
//// Create Router ////
///////////////////////
const router = express.Router()

//////////////////////////////
//// Routes + Controllers ////
//////////////////////////////
// GET -> /crypto/:name
// gives us all crypto in the api index
router.get('/all', (req, res) => {
  const { username, loggedIn, userId } = req.session
  // we have to make out api call
  axios(allCoinUrl)
    // if we get data, render an index page
    .then(apiRes => {
      console.log('this came back from api: /n', apiRes.data[0])

      res.send(apiRes.data)
    })
    // if something goes wrong display an error page
    .catch(err => {
      console.log('error')
      res.redirect(`/error?error=${err}`)
  })
})


//give us a specific crypto details


///////////////////////
//// Export Router ////
///////////////////////
module.exports = router

//bitcoin,ethereum,tether,cardano,solana,dogecoin,polkadot,polygon,tron,avalanche,litecoin,stellar,
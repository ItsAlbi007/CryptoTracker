// import dependecies

const express = require ('express')
const { appendFile } = require('fs')
require('dotenv').config()
const path = require('path')
const middleware = require('./utils/middleware')
//import routers




// creat the app object
const app = express()

// view engine - ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


//middleware
middleware(app)



//routes

app.get('/', (req, res) => {
  const { username, loggedIn, userId} = req.session
 // res.send('the app is connected')
 res.render('home.ejs', { username, loggedIn, userId })
})



//server listner
const PORT = process.env.PORT


app.listen(PORT, () => {
  console.log('server is running')
})




//end
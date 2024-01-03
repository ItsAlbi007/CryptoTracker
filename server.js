// import dependecies

const express = require ('express')
const { appendFile } = require('fs')
require('dotenv').config()
const path = require('path')
const middleware = require('./utils/middleware')
//import routers
const UserRouter = require('./controllers/userControllers')



// creat the app object
const app = express()

// view engine - ejs
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')


//middleware
middleware(app)



//routes
// basic home route
app.get('/', (req, res) => {
  const { username, loggedIn, userId} = req.session
 // res.send('the app is connected')
 res.render('home.ejs', { username, loggedIn, userId })
})

app.use('/users', UserRouter)

// error page
app.get('/error', (req, res) => {
  const error = req.query.error || 'Ope! Something went wrong ... try again'

  const { username, loggedIn, userId} = req.session

 // res.send(error)
 res.render('error.ejs', { error, userId, username, loggedIn })
})

//server listner
const PORT = process.env.PORT


app.listen(PORT, () => {
  console.log('server is running')
})




//end
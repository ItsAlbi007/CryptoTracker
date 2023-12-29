// Import Dependencies

const express = require('express') // express framework
const morgan = require('morgan')// morgan logger for request info
const session = require('express-session')
const MongoStore = require('connect-mongo')// connect-mongo(for the session)
require('dotenv').config()
const methodOverride = require('method-override')// for form and CRUD



// Middleware Function

const middleware = (app) => {
    // middleware runs before all routes
    // EVERY request is first processed through middleware
    // method-override - allows us to use forms to their full potential
  app.use(methodOverride('_method'))
    // morgan logs our request to the console
  app.use(morgan('tiny')) // tiny is a qualifier thats says - be short
    // to server stylesheets, we use static files in the public drectory
  app.use(express.static('public'))
    // to utilize json we can add this:
  app.use(express.json())

    // here ,we are setting up and utilizing a session function
    // we pass taht function an argument, a configuration object
    // a config object needs several keys in order to wrk ( see express-session docs for this)
    // the keys are : 
      // secret - top secret code taht creates an individual session from the app that calls this function
      // kinda like authorization, allows our app to connect to mongodb
      // that uses the connect-mongo(see docs for more)
      // sore - tells connect-mongo where to save the session(our db)
      // the two other options can be reaad about in the connect-mongo docs
  app.use(
    session({
      secret: process.env.SECRET,
      store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL
      }),
      saveUninitialized: true,
      resave: false
    })
  )
}




// Export the Middleware function

module.exports = middleware
// Import Dependecies

const express = require('express') //import express framework
const { appendFile } = require('fs')
require('dotenv').config() // import/load ENV variables
const path = require('path') // import path module



// Import Routers




// Create the app object

const app = express() // call the express function


// Middleware



// Routes

app.get('/', (req, res) => {
  res.send('the app is connected')
}) 


// Server Listener
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('your server is running, better go catch it')
})



// END
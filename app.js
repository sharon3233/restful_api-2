const dotenv = require('dotenv')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
// Import Routes 
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')

dotenv.config()

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


// Middleware
app.use(express.json())
// Route Middlewares
app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)

app.listen(3000, () => console.log('Server Started!'))
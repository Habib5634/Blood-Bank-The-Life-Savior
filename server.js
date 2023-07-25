const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require('./config/db')



//dot config
dotenv.config()

//connect db
connectDB()

//rest object
const app = express()

//middleware
app.use(express.json())
app.use(cors())
app.use(morgan('dev'))




//routes
app.use('/api/v1/auth', require("./routes/authRoutes"))
app.use('/api/v1/inventury', require('./routes/inventuryRoutes'))
app.use('/api/v1/analytics', require('./routes/analyticsRoutes'))
app.use("/api/v1/admin", require("./routes/adminRoutes"));


//port
const PORT = process.env.PORT || 8080



//listen
app.listen(PORT, () => [
    console.log(`Node Server is running in ${process.env.DEV_MODE} Mode on Port ${process.env.PORT}`.bgBlue.white)
])
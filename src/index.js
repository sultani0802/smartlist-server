const log = console.log

const express = require('express')

const userRouter = require('./routers/userRouter')

// Run database connection
require('./db/mongoose')


/**
 * Express Settings
 */

const app = express()                   // Init express
const PORT = process.env.PORT || 3000   // Set port for server
app.use(express.json())                 // Automatically parse incoming JSON into js                                            objects

/**
 * Endpoints from routers
 */
app.use(userRouter)


// Run the server
app.listen(PORT, () => {
    log('Server is running on port ', PORT)
})  
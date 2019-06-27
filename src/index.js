const log = console.log

const express = require('express')


// Run database connection
require('./db/mongoose')


/**
 * Express Settings
 */

const app = express()                   // Init express
const PORT = process.env.PORT || 3000   // Set port for server
app.use(express.json())                 // Automatically parse incoming JSON into js                                            objects


// Run the server
app.listen(PORT, () => {
    log('Server is running on port ', PORT)
})  

const User = require('./models/user')

const user = new User({
    name: 'Haamed'
})

try {
    user.save()
} catch (e) {
    log('Error ', e)
}
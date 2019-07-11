const log = console.log

const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) => {
    log('\nAuth middleware starting...')
    
    log('\nUser\'s request:')
    log('\tRequest type:  ' + req.method + '\n\tURL Path:  ' + req.path)
    
    try {
        // Get the token in the header frmo the user's request
        const token = req.header('Authorization').replace('Bearer ', '')
        // Check if token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Find the user based on the id and the token
        const user = await User.findOne( {_id: decoded._id, 'token': token} )
        
        // If the user is not found
        if (!user) {
            throw new Error()
        }
        
        req.user = user
        req.token = token

        next()
    } catch (e) {
        res.status(401).send( {
            error: 'Authentication failed'
        })
    }
}

module.exports = auth
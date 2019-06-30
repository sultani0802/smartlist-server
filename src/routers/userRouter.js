const log = console.log

// Libraries
const express = require('express')
const router = new express.Router()

// Routers
const User = require('../models/user')



/**
 * Description:
 *      This endpoint creates a new User Document and saves to the DB
 * 
 * Parameters:
 *      A JSON object from the request's body that contains essential user information
 */
router.post('/users', async (req, res) => {
    const user = new User(req.body)         // Create User Document

    try {
        await user.save()                   // Try to save the Document
        
        res.status(201).send( {             // Respond with 201 status
            user                                // And user object
        })
    } catch (e) {
        res.status(400).send(e)
    }
})


/**
 * Description:
 *      This endpoint deletes a User Document from the DB
 * 
 * Parameters:
 *      A JSON object from the request's body that contains essential user information
 */
router.delete('/users/me/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        await user.remove()     // Delete the User Document from DB

        res.send(req.user)          // Respond with deleted Document
    } catch (e) {
        res.status(500).send(e)
    }
})



module.exports = router
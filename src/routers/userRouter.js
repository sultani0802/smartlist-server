const log = console.log

// Libraries
const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')

// Routers
const User = require('../models/user')


        /**
        * POST REQUESTS
        */

/**
 * Description:
 *      This endpoint creates a new User Document and saves to the DB
 * 
 * Parameters:
 *      A JSON object from the request's body that contains essential user information
 */
router.post('/users', async (req, res) => {
    const user = new User(req.body)                     // Create User Document

    try {
        await user.save()                               // Try to save the Document
        const newToken = await user.generateAuthToken() // Generate auth token
        
        res.status(201).send( {                         // Respond with 201 status
            user,                                       // And user object
            newToken                                    // and token
        })
    } catch (e) {
        res.status(400).send(e)
    }
})


/**
 * Description:
 *      Logs the user in by finding a matching pair in the DB
 * 
 * Parameters (in body of the request):
 *      email: The user's email
 *      password: the corresponding password
 */
router.post('/users/login', async (req, res) => {
    try {
        // Try to find the User Document using our statics function
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const newToken = await user.generateAuthToken()

        res.send({user, newToken})              // Respond with the matching User Document
    } catch (e) {
        res.status(400).send(e)                 // Error
    }
})


/**
 * Description:
 *      Logs the user out of their session by deleting the auth token from the User Document
 */
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.token = undefined      // Clear the auth token

        await req.user.save()           // Save the User Document

        res.send({
            "success" : "You have been successfully logged out"
        }) // Respond to request
    } catch (e) {
        res.status(500).send(e)
    }
})


        /**
        * DELETE REQEUSTS
        */


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
        res.status(500).send({"error" : e})
    }
})



module.exports = router
const log = console.log

const express = require('express')
const router = new express.Router()

const User = require('../models/user')




router.post('/newUser', async (req, res) => {
    const user = new User(req.body)
})
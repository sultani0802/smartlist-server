const log = console.log

const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)

module.exports = User
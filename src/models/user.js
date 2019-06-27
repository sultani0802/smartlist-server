const log = console.log

const mongoose = require('mongoose')
const v = require('validator')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!this.v.isEmail(value)) {
                throw new Error('Invalid email format')
            }
        }
    }
}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema)

module.exports = User
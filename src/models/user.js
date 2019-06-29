const log = console.log

/**
 *      Modules
 */
const mongoose = require('mongoose')
const v = require('validator')
const bcrpyt = require('bcryptjs')


/**
 *      Schema
 */
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!v.isEmail(value)) {
                throw new Error('Invalid email format')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    }
}, {
    timestamps: true
})



/**
 *      Middleware
 */

 /**
  * Description:
  *         This method will be executed before the User Document is saved.
  *         It hashes user's password before it is saved in the DB
  * 
  * Parameters:
  *     next: Nothing is ever passed into the next argument, it is just used
  *           to continue the program
  */
userSchema.pre('save', async function (next) {
    const user = this   
    
    if (user.isModified('password')) {                      // If the password provided is new
        user.password = await bcrpyt.hash(user.password, 8) // Hash the password
    }

    next()                                                  // Continue the program
})


const User = mongoose.model('User', userSchema)

module.exports = User
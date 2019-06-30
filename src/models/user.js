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


/**
 * Description:
 *      Anytime our server sends the User document back in a response this method     *      will be run.
 *      This method filters out the password because it is confidential.
 *
 * Note: This does not affect or change what is actually in the DB
 * Returns:
 *      A modified copy of the User Document
 */
userSchema.methods.toJSON = function () {
    const user = this                   // Reference to the User Document
    const publicUser = user.toObject()  // Create a copy and convert to js object

    delete publicUser.password          // Remove the password from the copy

    return publicUser                   // Return the modified copy
}

const User = mongoose.model('User', userSchema)

module.exports = User
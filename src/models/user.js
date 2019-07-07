const log = console.log

        /**
         *      Modules
         */
const mongoose = require('mongoose')
const v = require('validator')
const bcrpyt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    },
    token : {
        type: String
    }
}, {
    timestamps: true
})



        /**
        * Static Methods
        */

/**
 * Description:
 *      Checks for a matching email and password
 *      This is to be used to log the user in
 * 
 * Parameters:
 *      email: The email the user is trying to log into
 *      Pass: The password associated to that email
 */
userSchema.statics.findByCredentials = async (email, pass) => {
    const user = await User.findOne({email})                    // Find User Document using email

    if (!user) {                                                // Throw error if no matching email is found
        throw new Error('Email doesn\'t exist.')
    }

    const isMatch = await bcrpyt.compare(pass, user.password)   // Check if the pass is correct

    if (!isMatch) {                                             // Throw error if password is wrong
        throw new Error('Password is incorrect.')
    }

    return user                                                 // Otherwise, successful login
}



        /**
        * Model Methods
        */

/**
 * Description:
 *      Generates an auth token using JWT and adds it to the "tokens" array in the User Document
 * 
 * Returns: 
 *      The token that was generated for this User
 */
userSchema.methods.generateAuthToken = async function () {
    // Reference to User instance's User Document
    const user = this
    // Create a token 
    const token = jwt.sign({_id:user._id.toString()}, process.env.JWT_SECRET)

    user.token = token     // Set the User Document's token
    
    await user.save()                               // Save the User Document

    return token                                    // Return the token
}


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
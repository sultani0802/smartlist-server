/**
 * This file is used to use the Mongoose npm module.
 *
 * It's an Object Document Mapper, which means it allows us to map js objects to mongodb Documents.
 * 
 * Mongoose also allows us to create objects and validate ceratin properties and user authentication
 */

const mongoose = require('mongoose')

/**
 * Description:
 *      Connects to our mongoDB database
 * 
 * Parameters:
 *      Database URL:   The URL to our database
 *      Options object: Customization for our mongoDB database
 */
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,    // Removes deprecation warning for                                                  Model.findByIdAndUpdate()
})
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username: {type: String, required: true, unique: true, index: true},
    password: {type: String, required: true, unique: true}

})

module.exports = mongoose.model("users", userSchema)
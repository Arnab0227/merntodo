const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    title: {type: String, required: true},
    description:{type: String, required: true},
    userId: {type: mongoose.Types.ObjectId, ref:'users', index: true},
    completed: { type: Boolean, default: false }
})

module.exports = mongoose.model("lists", todoSchema)
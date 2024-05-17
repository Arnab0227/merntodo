require('dotenv').config()
const mongoose = require('mongoose')

const db = process.env.DATABASE
mongoose.connect(db)
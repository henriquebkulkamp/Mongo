const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/nameDataBase', { useMongoClient: true })
mongoose.Promise = global.Promise

module.exports = mongoose

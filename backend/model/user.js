var bcrypt = require('bcrypt-nodejs')
var crypto = require('crypto')
var mongoose = require('mongoose')
var validate = require('mongoose-validator')

var userSchema = new mongoose.Schema({
  amazonId: {
    type: String,
    required: true,
  },
  emails: {
    type: Array
  }
})

module.exports = mongoose.model('users', userSchema);

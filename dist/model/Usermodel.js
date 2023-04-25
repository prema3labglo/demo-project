"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema,
  model = mongoose.model;
var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 4,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  DOB: {
    type: String,
    required: true
  },
  qualification: {
    type: String,
    required: true
  },
  isadmin: {
    type: Boolean,
    "default": false,
    required: false
  },
  place: {
    type: String,
    required: true
  }
});
var UserModel = model('User', UserSchema);
module.exports = UserModel;
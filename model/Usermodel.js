const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  DOB: { type: String, required: true },
  qualification: { type: String, required: true },
  isadmin:{type:Boolean,default:false,required:false},
  place:{type:String,required:true}
});

const UserModel = model('User',UserSchema);

module.exports = UserModel;
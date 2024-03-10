const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },
  bio: {
    type: String
  },

  profilePicture: {
    type: String
  },

  tokens: [{ type: String }],

  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'

    }],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
}, { timestamps: true });

// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next();
//     this.password = await bcrypt.hash(this.password, 10);
//     next();
//   });

//   userSchema.methods.getJWTToken = function () {
//     return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
//       expiresIn: "10d",
//     });
//   };

//   userSchema.methods.comparePassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
//   };

module.exports = model('User', userSchema);

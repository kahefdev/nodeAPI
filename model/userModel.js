const mongoose = require('mongoose');
const validator = require('validator').default;
const bcrype = require('bcrypt');

let userSchema = new mongoose.Schema({
  name: {
    required: [true, 'A name is required'],
    type: String,
  },
  email: {
    required: [true, 'Email is required'],
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A password is required'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please type confirm password'],
    minlength: 8,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrype.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

let User = mongoose.model('User', userSchema);

module.exports = User;

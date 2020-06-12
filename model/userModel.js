const mongoose = require('mongoose');
const validator = require('validator').default;
const bcrype = require('bcrypt');

let userSchema = new mongoose.Schema({
  name: {
    required: [true, 'A name is required'],
    type: String,
  },
  userType: {
    enum: ['user', 'administator'],
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
    select: false,
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
  pca: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrype.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPass = async function (
  currentPassword,
  orignalPassword
) {
  return await bcrype.compare(currentPassword, orignalPassword);
};

userSchema.methods.changedPassword = async function (JWTTimestamp) {
  let changedTimeStamp = this.pca.getTime();
  console.log(changedTimeStamp / 1000, JWTTimestamp);
  if (this.pca) {
    return changedTimeStamp / 1000 > JWTTimestamp;
  }
  return false;
};
let User = mongoose.model('User', userSchema);

module.exports = User;

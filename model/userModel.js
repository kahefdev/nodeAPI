const mongoose = require('mongoose');
const validator = require('validator').default;
const bcrype = require('bcrypt');
const crypto = require('crypto');
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
  role: {
    type: String,
    enum: ['user', 'admin'],
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
  passwordResetToken: String,
  resetTokenCreated: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', function () {
  if (!this.isModified(password) || this.isNew) return next();
  this.pca = Date.now() - 1000;
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
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
  console.log('Correct password method invoked');
  console.log(currentPassword, orignalPassword);
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

userSchema.methods.createPasswordResetToken = function () {
  let resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log(resetToken, this.passwordResetToken);
  this.resetTokenCreated = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

let User = mongoose.model('User', userSchema);

module.exports = User;

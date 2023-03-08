const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String, // setting name to string- it must be string so as not to throw an error
    required: true, // self-explicit
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // this stops people from creating an account w same email.
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is invalid')
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) { // custom validator - means - whatever value you pass will throw an error if it doesn't meet the requirement.
      if (value < 0) {
        throw new Error('Age must be a positive number')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('password has less than 6 characters or contains the word "password"')
      }
    },
    trim: true,
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

// creating a virtual field/object 
userSchema.virtual('tasks', {
  ref: 'Task',
  localField: "_id", // task id i think
  foreignField: "owner" // owner id yes. 
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject() // mongoose function

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  // console.log(user)
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewproject')
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) {
    throw new Error('Unable to log in')
  }

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error("Unable to log in")
  }

  return user
}

// pre - to do something before an event.
// post - for doing something after an event.

// hash the plain-text password before saving.
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next() // if we don't call next, it's just gonna hang forever and think we're running some code before we save the user and it'll never actually save the user.
}) // takes two arguments


// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
  const user = this
  await Task.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
// module.exports = { User } // dont you ever do this, it'd throw an error
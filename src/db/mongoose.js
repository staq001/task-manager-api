const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
  // UseCreateIndex: true // this seems not to work anymore. it throws an error and i don't know why. checked and it has been deprecated.

  // this makes sure that when mongoose works with mongodb, our indexes are created, allowing us to quickly access the data we need to access.
})

// very similar to MongoClient.connect as mongoose uses mongodb's server behind the scenes.
// task-manager-api is just a new name we just picked.

// const User = mongoose.model('User', {
//   name: {
//     type: String, // setting name to string- it must be string so as not to throw an error
//     required: true, // self-explicit
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error('Email is invalid')
//       }
//     }
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(value) { // custom validator - means - whatever value you pass will throw an error if it doesn't meet the requirement.
//       if (value < 0) {
//         throw new Error('Age must be a positive number')
//       }
//     }
//   },
//   password: {
//     type: String,
//     required: true,
//     validate(value) {
//       if (value.length < 7 || value.toLowerCase().includes('password')) {
//         throw new Error('password has less than 6 characters or contains the word "password"')
//       }
//     },
//     trim: true,
//   }

// })
// // accepts two arguments- the string name for your model and definition where we define all the fields we want.

// const me = new User({
//   name: 'Omotola ',
//   email: 'mIKe@gmail.cOm',
//   password: 'passw23'

// })

// me.save().then(() => {
//   console.log(me)
// }).catch((error) => { 'Error!', console.log(error) })
// // this saves the data that stored and returns a promise.

// // the result gives an '_v' which stores the version of the document.
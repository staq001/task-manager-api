const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User" // this is the model name like it is typed in user model, line 99
  }
}, {
  timestamps: true
})

const Task = mongoose.model('Task', taskSchema)


module.exports = Task
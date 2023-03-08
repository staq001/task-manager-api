const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true
})


const Task = mongoose.model('Task', {
  description: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
})

const tasks = new Task({
  description: 'Dishes cleaning                           ',
  completed: true
})

tasks.save().then(() => {
  console.log(tasks);
}).catch((error) => {
  console.log(error)
})
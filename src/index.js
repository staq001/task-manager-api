const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const jwt = require('jsonwebtoken')

const app = express()
const port = process.env.PORT

// making sure this is right above the app.use() call
// app.use((req, res, next) => {
//   // console.log(req.method, req.path)
//   // next()

//   if (req.method === "GET") {
//     res.send('GET requests are disabled')
//   } else {
//     next()
//   } // making the application run/not if a user uses either GET or POST or sumn.
// })

// app.use((req, res, next) => {
//   res.status(503).send('App is in maintenance mode. Please come back in few minutes')
// })


// const multer = require('multer')

// const upload = multer({
//   dest: 'images',   // short for destination
//   limits: {
//     fileSize: 1000000  // no in bytes----- 1MB
//   },
//   fileFilter(req, file, cb) {
//     // check API section of readMe of multer
//     // if (!file.originalname.endsWith('.pdf')) {OR 
//     if (!file.originalname.match(/\.(doc|docx)$/)) {  // using regular expression. // tryna learn it
//       return cb(new Error('Please upload a Word document'))
//     }

//     cb(undefined, true)
//   }
// })

// // const errorMessage = (req, res, next) => {
// //   throw new Error('From my middleware')
// // }  // test

// app.post('/upload', upload.single('upload'), (req, res) => { // just pick a name for the string.
//   res.send()
// }, (error, req, res, next) => {
//   res.status(400).send({ error: error.message })
// })



app.use(express.json()) // this parses the incoming JSON data for us so we have it as an accessible object we can use.
app.use(userRouter)
app.use(taskRouter)

// Without middleware : new request => run route handler

// With middleware : new request -> do something -> run route handler.

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})

// const bcrypt = require('bcryptjs')

// const myFunction = async () => {
//   const token = jwt.sign({ _id: 'ab123' }, 'thisismynewcourse', { expiresIn: '7 days' }) // takes two arguments. 1.object 2. secret string
//   console.log(token)

//   const data = jwt.verify(token, 'thisismynewcourse') // takes two arguments // verifying the second token
//   console.log(data);
// }

// myFunction()

// const pet = {
//   name: 'Hal'
// }

// pet.toJSON = function () {
//   return {}
// }

// // console.log(JSON.stringify(pet));

const Task = require('./models/task')
const User = require('./models/user')

// const main = async () => {

//   // const task = await Task.findById('63c8023dd21ca3d68cc122cf')
//   // await task.populate('owner')
//   // console.log(task.owner);
//   // connecting the task to the user

//   // const user = await User.findById('63c80187d21ca3d68cc122c8')
//   // await user.populate('tasks')   // works
//   // console.log(user.tasks)

// }
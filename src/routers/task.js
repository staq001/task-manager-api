const express = require('express')
const auth = require('../middleware/auth')
const Task = require('../models/task')
const { findById, findOne } = require('../models/user')
const router = new express.Router()


router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body)
  const task = new Task({
    ...req.body,
    owner: req.user._id

    // we're making sure the task is registered to the owner that created it, hence the owner's id it takes 
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }

  // task.save().then(() => {
  //   res.status(201).send(task)
  // }).catch((error) => {
  //   res.status(400).send(error)
  // })
})


// GET /tasks?completed=true
// GET /tasks?limit=2&skip=2
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => { // provides everything in the db
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true' // converting to boolean
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === "desc" ? -1 : 1
    // basically sort.createdAt = -1 || 1
  }

  try {
    // const task = await Task.find({ owner: req.user._id }) // OR

    await req.user.populate({
      path: "tasks",
      match, // shorthand
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort
      }
    })
    res.send(req.user.tasks)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    // const task = await Task.findById(_id)
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send()
    }

    res.status(201).send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})


router.patch('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id
  const updates = Object.keys(req.body)
  const validOptions = ['description', 'completed']

  const validUpdates = updates.every((update) => validOptions.includes(update))

  if (!validUpdates) res.status(400).send({ error: "Invalid updates" })

  try {
    const task = await Task.findOne({ _id, owner: req.user._id })

    if (!task) {
      return res.status(404).send({ error: 'User not found' })
    }

    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task) {
      res.status(404).send({ error: "User not found" })
    }

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})




module.exports = router
const express = require('express')
const router = new express.Router()
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { findByIdAndUpdate } = require('../models/user')
const { sendWelcomeEmail } = require('../emails/account')
const { sendCancelEmail } = require('../emails/account')
// using destructuring to get the object out.
const multer = require('multer')

// // creating a new router
// router.get('/test', (req, res) => {
//   res.send('This is from my router!')
// })
// // this hasnt been registered to work with our express application tho. to do that.we have to register our router w our existing app using------ app.use(router)

// SIGN UP
router.post('/users', async (req, res) => {
  const user = new User(req.body)
  // req.body refers to your JSON data coming from postman or wherever you're sending it from

  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }    // async/await version of what's below.

  // user.save().then(() => {
  //   res.status(201).send(user)
  // }).catch((error) => {
  //   res.status(400).send(error) // chaining
  // })
})

// LOGIN
router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
})

// READ/ serve user profile
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)

  // try {
  //   const users = await User.findOne({})
  //   res.send(users)
  // } catch (e) {
  //   res.status(500).send(e)
  // }

  // User.find({
  //   // basically a mongoose function, read the docs under queries
  // }).then((users) => {
  //   res.send(users)
  // }).catch((e) => {
  //   res.status(500).send(e) // internal server error
  // })
})

// logout from current device
router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {

      return token.token !== req.token
      // if equal, true. false if otherwise.
    })
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})

// Log out from all devices
router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
})


// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id
//   // console.log(req.params) // returns what comes after /users/

//   try {
//     const user = await User.findById(_id)
//     if (!user) {
//       return res.status(404).send()
//     }

//     res.send(user)
//   } catch (e) {
//     res.status(500).send(e)
//   }

//   // User.findById(_id).then((user) => {
//   //   if (!user) {
//   //     return res.status(404).send()
//   //   }
//   //   res.send(user)
//   // }).catch((e) => {
//   //   res.status(500).send(e)

//   // })

//   // NOTE - when you search by id, i think you need to type atleast 24 characters even if fake. failure to do so throw an internal server error.

// })


// UPDATE user
router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  // const _id = req.params.id

  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update)  // js method for if --- in -----
  })
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" })
  }

  try {
    // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true }) // writing a fix below
    // const user = await User.findByIdAndUpdate(req.user._id)

    updates.forEach(update => req.user[update] = req.body[update]);
    await req.user.save()

    res.send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
}) // designend for updating an existing resource.

// DELETE USER
router.delete('/users/me', auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.user._id)

    // if (!user) {
    //   return res.status(404).send()
    // }
    await req.user.remove()
    sendCancelEmail(req.user.email, req.user.name)


    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

// setting middleware for upload of data
const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
      return cb(new Error('File is not a supported format. Supported formats are PNG, JPEG and JPG'))
    }

    cb(undefined, true)
  }
})

// upload avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer() // resizing and converting to png and back to buffer

  req.user.avatar = buffer

  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

// delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined
  await req.user.save()
  res.status(200).send()
})

// serving up the avatar of the user.
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user || !user.avatar) {
      throw new Error()
    }

    res.set('Content-Type', 'image/png')
    res.send(user.avatar)
  } catch (e) {
    res.status(400).send()
  }
})


module.exports = router
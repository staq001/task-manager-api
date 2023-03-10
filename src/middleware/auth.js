const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '') // removing string 'bearer' in postman ----NB
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`)
    // console.log(token);
    // console.log(decoded)
    // req.header handles incoming headers

    const user = await User.findOne({ _id: decoded._id, "tokens.token": token })

    if (!user) {
      throw new Error()
    }

    req.token = token
    req.user = user
    // givng the router access to the user that we fetched from the database.
    next()
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" })
  }
}
module.exports = auth

// middleware function.
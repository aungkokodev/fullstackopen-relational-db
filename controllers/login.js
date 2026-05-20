const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(400).json({ error: 'both username and password are required' })

  const user = await User.findOne({
    where: {
      username,
    },
  })

  if (!user) return res.status(401).json({ error: 'invalid username or password' })

  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) return res.status(401).json({ error: 'invalid username or password' })

  const payload = { id: user.id, username: user.username }
  const token = jwt.sign(payload, SECRET)

  res.status(200).json({ ...payload, token })
})

module.exports = router

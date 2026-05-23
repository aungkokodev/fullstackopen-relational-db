const router = require('express').Router()
const { User, Session } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

router.post('/', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ error: 'both username and password are required' })
  }

  const user = await User.findOne({
    where: {
      username,
    },
  })

  const passwordCorrect = user && (await bcrypt.compare(password, user.passwordHash))

  if (!user || !passwordCorrect) {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  if (user.disabled) {
    return res.status(403).json({ error: 'your account has been disabled' })
  }

  const payload = { id: user.id, username: user.username }
  const token = jwt.sign(payload, SECRET, { expiresIn: 60 * 2 })

  await Session.create({ userId: user.id, token })

  res.status(200).json({ ...payload, token })
})

module.exports = router

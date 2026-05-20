const router = require('express').Router()
const { User, Blog } = require('../models')

const bcrypt = require('bcrypt')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId'],
      },
    },
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  const { username, password, name } = req.body

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ username, passwordHash, name })

  res.status(201).json(user)
})

router.get('/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'user not found' })
  }
})

module.exports = router

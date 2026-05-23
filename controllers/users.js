const router = require('express').Router()
const { User, Blog } = require('../models')

const bcrypt = require('bcrypt')
const ReadingList = require('../models/readinglist')

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
    attributes: {
      exclude: ['id'],
    },
    include: {
      model: Blog,
      as: 'readings',
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'userId'],
      },
      through: {
        attributes: [],
      },
      include: {
        model: ReadingList,
        attributes: ['id', 'read'],
      },
    },
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: 'user not found' })
  }
})

module.exports = router

const router = require('express').Router()
const { Blog, User } = require('../models')

router.get('/', (req, res) => {
  res.status(200).end()
})

router.post('/api/reset', async (req, res) => {
  await Blog.destroy({ cascade: true, truncate: true })
  await User.destroy({ cascade: true, truncate: true })
  res.status(200).end()
})

module.exports = router

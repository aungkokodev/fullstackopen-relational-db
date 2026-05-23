const router = require('express').Router()
const { Blog, User, ReadingList } = require('../models')

router.get('/', (req, res) => {
  res.status(200).end()
})

router.post('/api/reset', async (req, res) => {
  await ReadingList.destroy({ cascade: true, truncate: true })
  await Blog.destroy({ cascade: true, truncate: true })
  await User.destroy({ cascade: true, truncate: true })
  res.status(200).end()
})

module.exports = router

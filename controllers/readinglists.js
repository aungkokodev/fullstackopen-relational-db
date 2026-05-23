const { User, Blog } = require('../models')
const ReadingList = require('../models/readinglist')

const router = require('express').Router()

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body

  if (!userId || !blogId) return res.status(400).json({ error: 'userId and blogId are required' })

  const user = await User.findByPk(userId)
  const blog = await Blog.findByPk(blogId)

  if (!user || !blog) return res.status(404).json({ error: 'Invalid userId or blogId' })

  const readinglist = await ReadingList.create({ userId, blogId })

  res.status(201).json(readinglist)
})

module.exports = router

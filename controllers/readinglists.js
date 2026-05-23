const router = require('express').Router()
const { Op } = require('sequelize')
const { User, Blog, ReadingList } = require('../models')
const { extractToken } = require('../middlewares')

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body

  if (!userId || !blogId) {
    return res.status(400).json({ error: 'userId and blogId are required' })
  }

  const user = await User.findByPk(userId)
  const blog = await Blog.findByPk(blogId)

  if (!user || !blog) {
    return res.status(404).json({ error: 'invalid userId or blogId' })
  }

  const exists = await ReadingList.findOne({
    where: {
      [Op.and]: [{ userId: user.id }, { blogId: blog.id }]
    }
  })

  if (exists) {
    return res.status(400).json({ error: 'reading list already exists' })
  }

  const readinglist = await ReadingList.create({ userId, blogId })

  res.status(201).json({
    id: readinglist.id,
    user_id: readinglist.userId,
    blog_id: readinglist.blogId,
    read: readinglist.read
  })
})

router.put('/:id', extractToken, async (req, res) => {
  const readinglist = await ReadingList.findByPk(req.params.id)

  if (!readinglist) {
    return res.status(404).json({ error: 'reading list does not exist' })
  }

  if (readinglist.userId !== req.decodedToken.id) {
    return res.status(401).json({ error: 'operation is not permitted' })
  }

  readinglist.read = req.body.read || false
  await readinglist.save()

  res.json(readinglist)
})

module.exports = router

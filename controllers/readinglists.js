const router = require('express').Router()
const { User, Blog, ReadingList } = require('../models')
const { extractToken } = require('../middlewares')
const { Op } = require('sequelize')

router.post('/', async (req, res) => {
  const { userId, blogId } = req.body

  if (!userId || !blogId) return res.status(400).json({ error: 'userId and blogId are required' })

  const user = await User.findByPk(userId)
  const blog = await Blog.findByPk(blogId)

  if (!user || !blog) return res.status(404).json({ error: 'Invalid userId or blogId' })

  const readinglist = await ReadingList.create({ userId, blogId })

  res.status(201).json(readinglist)
})

router.put('/:id', extractToken, async (req, res) => {
  const readinglist = await ReadingList.findOne({
    where: {
      [Op.and]: [{ userId: req.decodedToken.id }, { blogId: req.params.id }],
    },
  })

  if (!readinglist)
    return res.status(404).json({ error: 'blog does not exist in the user reading list' })

  readinglist.read = req.body.read || false
  await readinglist.save()

  res.json(readinglist)
})

module.exports = router

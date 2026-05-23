const router = require('express').Router()
const { Blog, User } = require('../models')
const { Op } = require('sequelize')
const { extractToken } = require('../middlewares')

const findBlog = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).json({ error: 'blog not found' })
  }
  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    where[Op.or] = {
      title: { [Op.iLike]: `%${req.query.search.trim()}%` },
      author: { [Op.iLike]: `%${req.query.search.trim()}%` },
    }
  }

  const blogs = await Blog.findAll({
    attributes: {
      exclude: ['userId'],
    },
    include: {
      model: User,
      attributes: ['name'],
    },
    order: [['likes', 'DESC']],
    where,
  })
  res.json(blogs)
})

router.post('/', extractToken, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({ ...req.body, userId: user.id })
  res.status(201).json(blog)
})

router.get('/:id', findBlog, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id', findBlog, async (req, res) => {
  req.blog.likes = req.body.likes
  await req.blog.save()
  res.json(req.blog)
})

router.delete('/:id', [extractToken, findBlog], async (req, res) => {
  if (req.blog.userId === req.decodedToken.id) {
    await req.blog.destroy()
    res.status(204).end()
  } else {
    res.status(403).json({ error: 'unauthorized' })
  }
})

module.exports = router

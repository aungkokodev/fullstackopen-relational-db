const router = require('express').Router()
const { Blog } = require('../models')

const findBlog = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  if (!req.blog) {
    return res.status(404).end()
  }
  next()
}

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

router.post('/', async (req, res) => {
  const blog = await Blog.create({ ...req.body })
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

router.delete('/:id', findBlog, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map((e) => e.message) })
  }

  if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'malformatted id or invalid database query' })
  }

  next(error)
}

router.use(errorHandler)

module.exports = router

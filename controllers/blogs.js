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
  try {
    const blog = await Blog.create({ ...req.body })
    res.status(201).json(blog)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.get('/:id', findBlog, async (req, res) => {
  res.json(req.blog)
})

router.put('/:id', findBlog, async (req, res) => {
  try {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } catch (error) {
    res.status(400).json({ error })
  }
})

router.delete('/:id', findBlog, async (req, res) => {
  await req.blog.destroy()
  res.status(204).end()
})

module.exports = router

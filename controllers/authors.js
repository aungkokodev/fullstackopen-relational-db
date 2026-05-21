const router = require('express').Router()
const { Blog } = require('../models')
const sequelize = require('sequelize')

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [sequelize.fn('COUNT', sequelize.col('id')), 'blogs'],
      [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('likes')), 0), 'likes'],
    ],
    group: 'author',
  })

  res.json(authors)
})

module.exports = router

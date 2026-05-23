const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Session } = require('../models')
const { SECRET } = require('../util/config')

router.delete('/', async (req, res) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    const token = authorization.substring(7)
    jwt.verify(token, SECRET)
    await Session.destroy({ where: { token } })
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  res.status(204).end()
})

module.exports = router

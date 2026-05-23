const router = require('express').Router()
const { Session } = require('../models')

router.delete('/', async (req, res) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    await Session.destroy({ where: { token: authorization.substring(7) } })
  } else {
    return res.status(400).json({ error: 'token missing' })
  }

  res.status(204).end()
})

module.exports = router

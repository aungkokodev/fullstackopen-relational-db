const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Session, User } = require('../models')

const extractToken = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    const token = authorization.substring(7)
    const decodedToken = jwt.verify(token, SECRET)

    const session = await Session.findOne({ where: { token } })
    if (!session) {
      return res.status(401).json({ error: 'session expired or logged out' })
    }

    const user = await User.findByPk(decodedToken.id)
    if (!user || user.disabled) {
      await Session.destroy({ where: { userId: user?.id } })
      return res.status(403).json({ error: 'user account is disabled' })
    }

    req.decodedToken = decodedToken
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

module.exports = {
  extractToken
}

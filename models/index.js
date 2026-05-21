const User = require('./user')
const Blog = require('./blog')

User.hasMany(Blog)
Blog.belongsTo(User)

const sync = async () => {
  await User.sync({ alter: true })
  await Blog.sync({ alter: true })
}

sync()

module.exports = {
  Blog,
  User,
}

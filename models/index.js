const User = require('./user')
const Blog = require('./blog')
const ReadingList = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_read' })

module.exports = {
  Blog,
  User,
}

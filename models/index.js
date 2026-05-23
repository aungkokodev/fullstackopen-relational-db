const User = require('./user')
const Blog = require('./blog')
const ReadingList = require('./readinglist')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
Blog.belongsToMany(User, { through: ReadingList, as: 'users_read' })

User.hasMany(ReadingList)
ReadingList.belongsTo(User)
Blog.hasMany(ReadingList)
ReadingList.belongsTo(Blog)

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog,
  User,
  ReadingList,
  Session,
}

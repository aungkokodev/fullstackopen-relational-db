const express = require('express')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.errors.map((e) => e.message) })
  } else if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'malformatted id or invalid database query' })
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ error: error.errors.map((e) => e.message) })
  } else {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  })
}

start()

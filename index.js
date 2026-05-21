const express = require('express')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const testsRouter = require('./controllers/tests')

const app = express()

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)
app.use('/', testsRouter)

const errorHandler = (error, req, res, next) => {
  console.log('----------Error----------')
  console.log(error)
  console.log('-------------------------')

  if (
    error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError'
  ) {
    return res.status(400).json({ error: error.errors.map((e) => e.message) })
  } else if (error.name === 'SequelizeDatabaseError') {
    return res.status(400).json({ error: 'malformatted id or invalid database query' })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }

  return res.status(500).json({ error: 'an internal server error occurred' })
}

app.use(errorHandler)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
  })
}

start()

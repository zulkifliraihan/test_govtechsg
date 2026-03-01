import 'dotenv/config'
import express from 'express'
import routes from './routes'

const app = express()
const PORT = process.env.PORT || 3000
const appName = process.env.APP_NAME || 'Test Govtech Singapore'
const appEnv = process.env.NODE_ENV || 'development'

app.use(express.json())

app.get('/', (_req, res) => {
  res.json({ message: `${appName} API is running` })
})

app.use('/api', routes)

app.listen(PORT, () => {
  console.log(`\n${ appName } (${appEnv}) listening to http://localhost:${ PORT }`)
})

export default app

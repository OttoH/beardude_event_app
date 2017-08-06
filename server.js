
import path from 'path'
import express from 'express'
import proxy from 'express-http-proxy'
import history from 'connect-history-api-fallback'

const app = express()
const port = process.env.SERVER_PORT || '3030'

app.get('/api/**/**', proxy('http://localhost:1337'))

app.use(history({
  verbose: !!process.env.DEBUG
}))

app.use(express.static(path.resolve(__dirname, '../dist/')))

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.error(err)
  } else {
    console.info(`Listening at http://localhost:${port}`)
  }
})

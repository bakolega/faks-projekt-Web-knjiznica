const app = require('./app')
const http = require('http')

const config = require('./utils/config')

const server = http.createServer(app)

server.listen(config.PORT, () => {
    //logger.info(`Server je pokrenut na portu ${config.PORT}`)
  })



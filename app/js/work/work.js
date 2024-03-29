const {HOME} = process.env;

const api = require('./../../api/api_desc')
const user = require('./work_user.js')
const group = require('./work_group.js')
const publ = require('./work_publications.js')
const sys = require('./work_system.js')

const winston = require('winston')
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({filename: `${HOME}/log/log.txt`})
    ]
})

const execute = (url, data) => {
    logger.info(['Execute', url, data])

    const request = url.split('/')
    switch (request[2]) {
        case api.ESSENCE.group.name :{
            return group.execute(url, data)
        }
        case api.ESSENCE.publication.name :{
            return publ.execute(url, data)
        }
        case api.ESSENCE.user.name :{
            return user.execute(url, data)
        }
        case api.ESSENCE.system.name :{
            return sys.execute(url, data)
        }
        default: {
            return new Promise((resolve, reject) => {
                reject(api.CODES_RESPONSE.notFound)
            })
        }
    }
}

module.exports = {
    execute
}
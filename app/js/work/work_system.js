const db = require('./database')
const api = require('./../api/api_desc')

const edit = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.update),
            data
        )
          .then(value => {
              if (value == null) {
                  resolve({
                      ...api.CODES_RESPONSE.alreadyReported,
                      datas: null
                  })
              }
              resolve({
                  ...api.CODES_RESPONSE.updated,
                  datas: value
              })
          })
          .catch(err => reject(err))
    })
}

const execute = (url, data) => {
    const request = url.split('/')
    switch (request[3]) {
        case api.ESSENCE.system.actions.edit : {
            return edit(data)
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
const db = require('./database')
const api = require('./../api/api_desc')

const add = (group) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.groups.name, api.ACTS.insert),
            group
        )
          .then(value => {
              if (value == null) {
                  resolve({
                      ...api.CODES_RESPONSE.alreadyReported,
                      datas: null
                  })
              }
              resolve({
                  ...api.CODES_RESPONSE.created,
                  datas: value
              })
          })
          .catch(err => reject(err))
    })
}

const edit = (group) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.groups.name, api.ACTS.update),
            group
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
        case api.ESSENCE.group.actions.addNew : {
            return add(data)
        }
        case api.ESSENCE.group.actions.edit : {
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
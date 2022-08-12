const db = require('./database')
const api = require('./../api/api_desc')

const addNew = (user) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.insert),
            user
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

const edit = (user) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.update),
            user
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

const checkAuth = (user) => {
    return new Promise((resolve, reject) => {
        db.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select), {auth: user})
          .then(user => {
              if (user.datas.findings.length == 0) {
                  reject(...api.CODES_RESPONSE.unauthorized)
              }
              else {
                  user.datas.findings[0].auth.pass = null
                  resolve({
                          ...api.CODES_RESPONSE.ok,
                          datas: {
                              findings: user.datas.findings[0]
                          }
                      }
                  )
              }
          })
    })
}

const execute = (url, data) => {
    const request = url.split('/')
    switch (request[3]) {
        case api.ESSENCE.user.actions.auth : {
            return checkAuth(data)
        }
        case api.ESSENCE.user.actions.addNew : {
            return addNew(data)
        }
        case api.ESSENCE.user.actions.edit : {
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
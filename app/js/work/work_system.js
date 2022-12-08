const db = require('./../database')
const api = require('./../../api/api_desc')

const keysChange = {
    accessRights: 'accessRights',
    groups: 'groups',
    users: 'users',
    themesOfPublication: 'themesOfPublication',
    publications: 'publications',
}

const setChange = (key) => new Promise((resolve, reject) => {
    db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.select)
    )
      .then(async response => {
          const data = {data: {change: response[0].change}}
          data.data.change[key] = true

          db.execute(
              api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.update),
              data
          )
            .then(value => resolve({
                ...api.CODES_RESPONSE.updated,
                datas: value
            }))
            .catch(err => {
                if (err.code == db.codes.duplicate) {
                    resolve({
                        ...api.CODES_RESPONSE.alreadyReported,
                        datas: err.keyValue
                    })
                    return
                }
                reject(err)
            })
      })
})

const edit = (data) => new Promise((resolve, reject) => {
    db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.update),
        data
    )
      .then(value => resolve({
          ...api.CODES_RESPONSE.updated,
          datas: value
      }))
      .catch(err => {
          if (err.code == db.codes.duplicate) {
              resolve({
                  ...api.CODES_RESPONSE.alreadyReported,
                  datas: err.keyValue
              })
              return
          }
          reject(err)
      })
})

const get = () => new Promise((resolve, reject) => {
    db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.select)
    )
      .then(findings => resolve({
          ...((findings.length == 0) ? (api.CODES_RESPONSE.notFound) : (api.CODES_RESPONSE.ok)),
          datas: {findings: findings[0] ?? null}
      }))
      .catch(err => reject(err))
})

const execute = (url, data) => {
    const request = url.split('/')
    switch (request[3]) {
        case api.ESSENCE.system.actions.edit : {
            return edit(data)
        }
        case api.ESSENCE.system.actions.get : {
            return get(data)
        }
        default: {
            return new Promise((resolve, reject) => {
                reject(api.CODES_RESPONSE.notFound)
            })
        }
    }
}

module.exports = {
    execute,
    setChange,
    keysChange
}
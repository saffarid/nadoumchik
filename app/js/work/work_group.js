const db = require('./../database')
const api = require('./../../api/api_desc')

const storage = require('./../storage')
const system = require('./work_system')

const add = (data) => new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.groups.name, api.ACTS.insert),
            data
        )
          .then(value => {
              system.setChange(system.keysChange.groups)
              resolve({
                  ...api.CODES_RESPONSE.created,
                  datas: value
              })
          })
          .catch(err => {
              if (err.code == db.codes.duplicate) {
                  resolve({
                      ...api.CODES_RESPONSE.alreadyReported,
                      datas: err.keyValue
                  })
              }
              reject(err)
          })
    })

const edit = (data) => new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.groups.name, api.ACTS.update),
            data
        )
          .then(value => {
              system.setChange(system.keysChange.groups)
              resolve({
                  ...api.CODES_RESPONSE.updated,
                  datas: value
              })
          })
          .catch(err => {
              if (err.code == db.codes.duplicate) {
                  resolve({
                      ...api.CODES_RESPONSE.alreadyReported,
                      datas: err.keyValue
                  })
              }
              reject(err)
          })
    })

const getGroups = (data) => new Promise((resolve, reject) => {
        const findings = Object.values(storage.getGroups())
        resolve({
            ...((findings.length == 0) ? (api.CODES_RESPONSE.notFound) : (api.CODES_RESPONSE.ok)),
            datas: {findings: (findings.length == 0) ? (null) : (findings)}
        })
    })

const execute = (url, data) => {
    const request = url.split('/')
    switch (request[3]) {
        case api.ESSENCE.group.actions.addNew : {
            return add(data)
        }
        case api.ESSENCE.group.actions.edit : {
            return edit(data)
        }
        case api.ESSENCE.group.actions.getGroups : {
            return getGroups(data)
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
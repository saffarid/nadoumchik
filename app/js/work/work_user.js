const db = require('./../database')
const api = require('./../../api/api_desc')
const hash = require('jshashes')
const storage = require('./../storage')
const system = require('./work_system')

const addNew = (data) => new Promise((resolve, reject) => {
    data.data['registrationDate'] = new Date()
    db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.insert),
        data
    )
      .then(value => {
          system.setChange(system.keysChange.users)
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
              return
          }
          reject(err)
      })
})

const edit = (data) => new Promise((resolve, reject) => {
    db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.update),
        data
    )
      .then(value => {
          system.setChange(system.keysChange.users)
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
              return
          }
          reject(err)
      })
})

const changePass = (data) => new Promise((resolve, reject) => {
    db.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select), data)
      .then(async response => {

          //Определяем существование пользователя с переданным _id
          if (Object.keys(response).length == 0) {
              //Условыие выполняется если пользователь не найден
              resolve({
                  ...api.CODES_RESPONSE.notFound,
              })
              return
          }

          const user = await db.convertRefsToClearObj(api.DATABASE.collections.users.schema, response)

          //Проверяем совпадение старых паролей
          if (new hash.SHA1().b64(data.data.oldPass).localeCompare(user.auth.pass) != 0) {
              resolve({
                  ...api.CODES_RESPONSE.notAcceptable,
              })
              return
          }

          user.auth.pass = new hash.SHA1().b64(data.data.newPass)
          db.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.update), {
              filter: {_id: user._id},
              data: user
          })
            .then(response => resolve({
                ...api.CODES_RESPONSE.updated,
                datas: {
                    findings: user
                }
            }))
      })
      .catch(err => reject(err))
})

const checkAuth = (data) => new Promise((resolve, reject) => {
    db.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select), data)
      .then(async user => {
          if (user.length == 0) {
              reject(api.CODES_RESPONSE.unauthorized)
          }
          else {
              let _user = user[0]
              _user.auth = undefined
              _user = await db.convertRefsToClearObj(api.DATABASE.collections.users.schema, _user)
              resolve({
                  ...api.CODES_RESPONSE.ok,
                  datas: {
                      findings: _user
                  }
              })
          }
      })
})

const getAllUsers = (data) => new Promise((resolve, reject) => {
    const findings = Object.values(storage.getUsers())
    resolve({
        ...((findings.length == 0) ? (api.CODES_RESPONSE.notFound) : (api.CODES_RESPONSE.ok)),
        datas: {findings: (findings.length == 0) ? (null) : (findings)}
    })
})

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
        case api.ESSENCE.user.actions.changePass : {
            return changePass(data)
        }
        case api.ESSENCE.user.actions.getAllUsers : {
            return getAllUsers(data)
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
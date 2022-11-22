const db = require('./../database')
const api = require('./../../api/api_desc')

const addNew = (user) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.insert),
            {
                registrationDate: new Date(),
                ...user
            }
        )
          .then(value => {
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
}

const edit = (user) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.update),
            user
        )
          .then(value => {
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
}

const changePass = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select), {_id: data._id})
          .then(response => {

              //Определяем существование пользователя с переданным _id
              if (response.length == 0) {
                  //Условыие выполняется если пользователь не найден
                  resolve({
                      ...api.CODES_RESPONSE.notFound,
                  })
                  return
              }

              const user = response[0]
              //Проверяем совпадение старых паролей
              if (data.oldPass.localeCompare(user.auth.pass) != 0) {
                  resolve({
                      ...api.CODES_RESPONSE.notAcceptable,
                  })
                  return
              }

              user.auth.pass = data.newPass

              db.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.update), user)
                  .then(response => {
                      if(response[0].auth.pass.localeCompare(data.newPass) == 0) {
                          resolve(
                              ...api.CODES_RESPONSE.updated
                          )
                      } else {
                          resolve(
                              ...api.CODES_RESPONSE.notImplemented
                          )
                      }
                  })

          })
          .catch(err => reject(err))
    })
}

const checkAuth = (user) => {
    return new Promise((resolve, reject) => {
        db.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select), {auth: user})
          .then(user => {
              if (user.length == 0) {
                  reject(api.CODES_RESPONSE.unauthorized)
              }
              else {
                  const _user = user[0]
                  _user.auth = undefined
                  resolve({
                          ...api.CODES_RESPONSE.ok,
                          datas: {
                              findings: _user
                          }
                      }
                  )
              }
          })
    })
}

const getAllUsers = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select),
            {}
        )
          .then(findings => {
              if (findings.length == 0) {
                  resolve({
                      ...api.CODES_RESPONSE.notFound,
                      datas: null
                  })
                  return
              }
              resolve({
                  ...api.CODES_RESPONSE.ok,
                  datas: {
                      findings: findings
                  }
              })
          })
          .catch(err => reject(err))
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
const db = require('./../database')
const api = require('./../../api/api_desc')
const storage = require('./../storage')
const system = require('./work_system')

/**
 * Функция возвращает выборку опубликованных публикаций по автору
 * */
const findSampleByAuthor = (data) => new Promise(async (resolve, reject) => {
    if (!('author' in data.filter)) reject(api.CODES_RESPONSE.badRequest)
    let findings = await db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.select),
        data
    )
    for (let i = 0; i < findings.length; i++) {
        findings[i] = await db.convertRefsToClearObj(api.DATABASE.collections.publications.schema, findings[i])
    }
    resolve({
        ...((findings.length == 0) ? (api.CODES_RESPONSE.noContent) : (api.CODES_RESPONSE.ok)),
        datas: {
            findings: findings,
            noMore: findings.length < data.limit
        }
    })
})

/**
 * Функция возвращает выборку сохранённых черновиков по автору
 * */
const findDraftsByAuthor = (data) => new Promise(async (resolve, reject) => {
    if (!('author' in data.filter)) reject(api.CODES_RESPONSE.badRequest)
    let findings = await db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.drafts.name, api.ACTS.select),
        data
    )
    for (let i = 0; i < findings.length; i++) {
        findings[i] = await db.convertRefsToClearObj(api.DATABASE.collections.drafts.schema, findings[i])
    }
    resolve(
        {
            ...((findings.length == 0) ? (api.CODES_RESPONSE.noContent) : (api.CODES_RESPONSE.ok)),
            datas: {
                findings: findings,
                noMore: findings.length < data.limit
            }
        }
    )
})

/**
 * Функция возвращает публикацию по её названию
 * */
const findByTitle = (data) => new Promise(async (resolve, reject) => {
    if (!('title') in data) reject(api.CODES_RESPONSE.badRequest)
    let findings = await db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.select),
        data
    )

    resolve({
        ...((findings.length == 0) ? (api.CODES_RESPONSE.noContent) : (api.CODES_RESPONSE.ok)),
        datas: {
            findings: findings,
            noMore: findings.length < data.limit
        }
    })

})

/**
 * Функция возвращает выборку публикаций
 * */
const findSample = (data) => new Promise(async (resolve, reject) => {
    let findings = await storage.getpublications(data.skip, data.limit)
    resolve({
        ...((findings.length == 0) ? (api.CODES_RESPONSE.noContent) : (api.CODES_RESPONSE.ok)),
        datas: {
            findings: findings,
            noMore: findings.length < data.limit
        }
    })
})

/**
 * Функция сохраняет черновик публикации
 * */
const saveDraft = (data) => new Promise((resolve, reject) => {
    db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.drafts.name, ('_id' in data.filter) ? (api.ACTS.update) : (api.ACTS.insert)),
        data
    )
      .then(value => resolve({
          ...(('_id' in data.filter) ? (api.CODES_RESPONSE.updated) : (api.CODES_RESPONSE.created)),
          datas: value
      }))
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

/**
 * Функция добавляет публикацю в коллекцию publications
 * */
const publish = (data) => new Promise((resolve, reject) => {
    db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.insert),
        data
    )
      .then(value => {
          system.setChange(system.keysChange.publications)
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

/**
 * Функция редактирует уже опубликованную публикацию
 * */
const edit = (data) => new Promise((resolve, reject) => {
    db.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.update),
        data
    )
      .then(value => {
          system.setChange(system.keysChange.publications)
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

/**
 * Функция удаляет полученный объект из БД
 * */
const removeDraft = (data) => new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.drafts.name, api.ACTS.remove),
            data
        )
          .then(value => {
              resolve({
                  ...api.CODES_RESPONSE.removed,
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

/**
 * Функция удаляет полученный объект из БД
 * */
const remove = (data) => new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.remove),
            data
        )
          .then(value => {
              system.setChange(system.keysChange.publications)
              resolve({
                  ...api.CODES_RESPONSE.removed,
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

const addTheme = (data) => new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.insert),
            data
        )
          .then(value => {
              system.setChange(system.keysChange.themesOfPublication)
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

const getThemes = (data) => new Promise((resolve, reject) => {
        const findings = Object.values(storage.getThemes())
        resolve({
            ...((findings.length == 0) ? (api.CODES_RESPONSE.noContent) : (api.CODES_RESPONSE.ok)),
            datas: {
                findings: findings,
            }
        })
    })

const editTheme = (data) => new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.update),
            data
        )
          .then(value => {
              system.setChange(system.keysChange.themesOfPublication)
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

const removeTheme = (data) => new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.remove),
            data
        )
          .then(value => {
              resolve({
                  ...api.CODES_RESPONSE.removed,
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

const execute = (url, data) => {
    const request = url.split('/')
    const a = api.ESSENCE.publication.actions
    switch (request[3]) {
        case a.findSampleByAuthor : {
            return findSampleByAuthor(data)
        }
        case a.findDraftsByAuthor : {
            return findDraftsByAuthor(data)
        }
        case a.findSample : {
            return findSample(data)
        }
        case a.findByTitle : {
            return findByTitle(data)
        }
        case a.saveDraft : {
            return saveDraft(data)
        }
        case a.edit : {
            return edit(data)
        }
        case a.publish : {
            return publish(data)
        }
        case a.remove : {
            return remove(data)
        }
        case a.addTheme : {
            return addTheme(data)
        }
        case a.getThemes : {
            return getThemes(data)
        }
        case a.editTheme : {
            return editTheme(data)
        }
        case a.removeTheme : {
            return removeTheme(data)
        }
        case a.removeDraft : {
            return removeDraft(data)
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



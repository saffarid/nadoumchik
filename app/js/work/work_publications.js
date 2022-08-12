const db = require('../database')
const api = require('../../api/api_desc.js')


/**
 * Функция возвращает выборку опубликованных публикаций или черновиков по автору
 * */
const findSampleByAuthor = (data) => {
    return new Promise(async (resolve, reject) => {
        if (!('author' in data)) reject(api.CODES_RESPONSE.badRequest)
        resolve(await findSample(data))
    })
}

/**
 * Функция возвращает публикацию по её названию
 * */
const findByTitle = (data) => {

    return new Promise(async (resolve, reject) => {

        if (!('title') in data) reject(api.CODES_RESPONSE.badRequest)

        const finding = await db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.select),
            data
        )

        if (findings.length == 0) {
            resolve({
                ...api.CODES_RESPONSE.noContent,
                datas: {
                    findings: [],
                    thereIsMore: false
                }
            })
            return
        }
        resolve({
            ...api.CODES_RESPONSE.noContent,
            datas: {
                findings: finding,
                thereIsMore: false
            }
        })

    })

}

/**
 * Функция возвращает выборку публикаций
 * */
const findSample = (data) => {

    return new Promise(async (resolve, reject) => {

        let findings = await db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.select),
            data
        )

        if (findings.length == 0) {
            resolve({
                ...api.CODES_RESPONSE.noContent,
                datas: {
                    findings: [],
                    thereIsMore: false
                }
            })
            return
        }

        findings = findings.reverse()

        if (!('shift' in data && 'count' in data)) {
            resolve({
                ...api.CODES_RESPONSE.ok,
                datas: {
                    findings: findings,
                    thereIsMore: false
                }
            })
            return
        }

        const range = data.shift + data.count

        if (range < findings.length) {
            resolve(
                {
                    ...api.CODES_RESPONSE.ok,
                    datas: {
                        findings: findings.slice(data.shift, range),
                        thereIsMore: true
                    }
                }
            )
        }
        else {
            resolve(
                {
                    ...api.CODES_RESPONSE.ok,
                    datas: {
                        findings: findings.slice(data.shift, data.count),
                        thereIsMore: false
                    }
                }
            )
        }

    })

}

/**
 * Функция сохраняет черновик публикации
 * */
const saveDraft = (data) => {

}

/**
 * Функция добавляет публикацю в коллекцию publications
 * */
const publish = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.insert),
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
                  ...api.CODES_RESPONSE.created,
                  datas: value
              })
          })
          .catch(err => reject(err))
    })
}

/**
 * Функция редактирует уже опубликованную публикацию
 * */
const edit = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.update),
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

/**
 * Функция удаляет полученный объект из БД
 * */
const remove = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.update),
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
                  ...api.CODES_RESPONSE.removed,
                  datas: value
              })
          })
          .catch(err => reject(err))
    })
}

const addTheme = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.insert),
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
                  ...api.CODES_RESPONSE.created,
                  datas: value
              })
          })
          .catch(err => reject(err))
    })
}

const editTheme = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.update),
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

const removeTheme = (data) => {
    return new Promise((resolve, reject) => {
        db.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.remove),
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
                  ...api.CODES_RESPONSE.removed,
                  datas: value
              })
          })
          .catch(err => reject(err))
    })
}

const execute = (url, data) => {
    const request = url.split('/')
    const a = api.ESSENCE.publication.actions
    switch (request[3]) {
        case a.findSampleByAuthor : {
            return findSampleByAuthor(data)
        }
        case a.findByTitle :  {
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
        case a.editTheme : {
            return editTheme(data)
        }
        case a.removeTheme : {
            return removeTheme(data)
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
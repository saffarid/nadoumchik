const mongoose = require('mongoose')
const hash = require('jshashes')
const {v4: uuid} = require('uuid')

const initDataDB = require('./default.js')
const api = require('./../../api/api_desc')

const system = require('../system.js')
const roleOfUser = require('../role_of_user_actions.js')
const user = require('../user_actions.js')

const Schema = mongoose.Schema

const models = {}

const runOnObject = (sysDef, sysDb) => {
    Object.keys(sysDef).forEach(((key, index, array) => {
        if (sysDb[key] === undefined || sysDb[key] === null) {
            //Если запись в БД не определена, тупо добавляем всё поле целиком
            sysDb[key] = sysDef[key]
        }
        else {
            //Если запись определена и...
            if (sysDb[key] === Object(sysDb[key])) {
                // и является объектом
                runOnObject(sysDef[key], sysDb[key])
            }
        }
    }))
}

const init = () => {
    Object.values(api.DATABASE.collections).forEach(value =>
        models[value.name] = mongoose.model(value.name, value.schema)
    )
    // find(api.DATABASE.collections.system.name, {shift:0, count: 0})
    //     .then(findings => {
    //         if (findings === null) {
    //             insert(api.DATABASE.collections.system.name, initDataDB.system)
    //         }
    //         else {
    //             runOnObject(initDataDB.system, findings._doc)
    //             update(api.DATABASE.collections.system.name, findings._doc)
    //                 .then(value => console.log(`Успешно обновлено ${value}`))
    //                 .catch(err => console.error(err))
    //         }
    //     })
    //     .catch(err => {
    //         console.error(err)
    //     })
    //
    //
    // Object.keys(initDataDB.roleOfUser).forEach(key => {
    //     find(api.DATABASE.collections.roleOfUser.name, {role:{name: key}})
    //         .then(findings => {
    //             if (findings.length === 0) {
    //                 insert(api.DATABASE.collections.roleOfUser.name, {name: key})
    //             }
    //             else {
    //                 //Оформить обновление информации
    //             }
    //         })
    // })
    //
    // initDataDB.users.forEach(value => {
    //     find(api.DATABASE.collections.users.name, {name: value.name})
    //         .then(findings => {
    //             console.log(findings)
    //             if (findings === null) {
    //                 find(api.DATABASE.collections.roleOfUser.name, {role: {name: value.role}})
    //                     .then(role => {
    //                         insert(api.DATABASE.collections.users.name, {
    //                             name: value.name,
    //                             pass: new hash.SHA1().b64(value.pass),
    //                             role_id: role._id
    //                         })
    //                     })
    //             }
    //         })
    // })

    // Object.keys(initDataDB).forEach(key => {
    //     insert(key, initDataDB[key])
    // })

}

/**
 * Функция проверяет наличие идентификатора
 * */
const isById = (data) => {
    return data['_id'] !== undefined
}
/**
 * Функция проверяет наличие параметров кол-ва выборки
 * */
const isSampling = (data) => {
    return ((data['shift'] !== undefined) && (data['count'] !== undefined))
}

/* --- Функции выборки --- */

/**
 * Функиця выполняет выборку в коллекции
 * @param collection {String} Наименование коллекции
 * @param terms {Object} условие выборки.
 * Для выборки по идентификатору - передавать объект вида {_id: some_data};
 * для выборки по кастомному параметру - {custom_key: some_data, ..., custom_key: some_data};
 * для выборки нескольких документов - {shift: начало_выборки, length: кол-во документов},
 * если необходимо получить все возможные объекты, достаточно передать нули {shift: 0, count: 0}.
 */
const find = (collection, terms) => {

    if (isById(terms)) {
        return findById(collection, terms)
    }
    else if (isSampling(terms)) {
        return findBySampling(collection, terms)
    }
    else {
        return findByCustomKeys(collection, terms)
    }

}

/**
 * Поиск по произвольному набору ключей
 * */
const findByCustomKeys = (collection, terms) => {
    return new Promise((resolve, reject) => {
        models[collection].findOne(terms)
                          .then(finding => resolve(finding))
                          .catch(err => reject(err))
    })
}

/**
 * Поиск по идентификатору
 * */
const findById = (collection, terms) => {
    return new Promise((resolve, reject) => {
        models[collection].findById(terms._id)
                          .then(finding => resolve(finding))
                          .catch(err => reject(err))
    })
}

/**
 * Поиск выборкой определённого кол-ва
 * */
const findBySampling = (collection, terms) => {
    return new Promise((resolve, reject) => {
        models[collection].find()
                          .then(findings => {
                              try {
                                  if (terms.shift > findings.length) throw new Error('Nothing return')

                                  if (collection === api.DATABASE.collections.publications.name) findings = findings.reverse()
                                  if (terms.shift === 0 && terms.count === 0) {
                                      resolve({
                                          findings: findings,
                                          thereIsMore: false
                                      })
                                  }

                                  const range = terms.shift + terms.count
                                  if (range < findings.length) {
                                      resolve({
                                          findings: findings.slice(terms.shift, range),
                                          thereIsMore: true
                                      })
                                  }
                                  else {
                                      resolve({
                                          findings: findings.slice(terms.shift, terms.count),
                                          thereIsMore: false
                                      })
                                  }
                              }
                              catch (e) {
                                  reject(e)
                              }
                          })
                          .catch(err => {
                              reject(err)
                          })
    })
}

/* --- Функции вставки --- */

/**
 * Функиця выполняет вставку в коллекцию
 * @param collection {String} Наименование коллекции
 * @param data {Object} вставляемые данные.
 */
const insert = (collection, data) => {
    if (Array.isArray(data)) {
        return insertMany(collection, data)
    }
    else {
        return insertOne(collection, data)
    }
}

/**
 * @param collection {String}
 * @param data {Object}
 * */
const insertOne = (collection, data) => {
    return new Promise((resolve, reject) => {
        data['_id'] = uuid()
        models[collection].create(data)
                          .then(value => resolve(value))
                          .catch(err => reject(err))
    })
}

/**
 * @param collection {String}
 * @param data {Array}
 * */
const insertMany = (collection, data) => {
    return new Promise((resolve, reject) => {
        data.forEach(value => {
            value['_id'] = uuid()
        })
        models[collection].insertMany(data)
                          .then(value => resolve(value))
                          .catch(err => reject(err))
    })
}

/* --- Функции удаления --- */

/**
 * Функиця выполняет удаление из коллекции
 * @param collection {String} Наименование коллекции
 * @param data {Object} удаляемые данные.
 */
const remove = (collection, data) => {
    if (isById(data)) {
        return removeById(collection, data)
    }
    else {
        return removeByCustomKeys(collection, data)
    }
}

/**
 * Удаление по идентификатору.
 * @param collection {String} Наименование коллекции
 * @param data {Object} удаляемые данные.
 * */
const removeById = (collection, data) => {
    return new Promise((resolve, reject) => {
        models[collection].findByIdAndDelete(data._id)
                          .then(removed => resolve(removed))
                          .catch(err => reject(err))
    })
}

/**
 * Удаление по произвольному набору ключей.
 * @param collection {String} Наименование коллекции
 * @param data {Object} удаляемые данные.
 * */
const removeByCustomKeys = (collection, data) => {
    return new Promise((resolve, reject) => {
        models[collection].findOneAndDelete(data)
                          .then(removed => resolve(removed))
                          .catch(err => reject(err))
    })
}

/* --- Функции обновления --- */

/**
 * Функиця выполняет обновление в коллекции
 * @param collection {String} Наименование коллекции
 * @param data {Object} удаляемые данные.
 */
const update = (collection, data) => {
    if (isById(data)) {
        return updateById(collection, data)
    }
    else {
        return updateByCustomKeys(collection, data)
    }
}

/**
 * Обновление по идентификатору.
 * @param collection {String} Наименование коллекции
 * @param data {Object} удаляемые данные.
 * */
const updateById = (collection, data) => {
    return new Promise((resolve, reject) => {
        models[collection].findByIdAndUpdate(data._id)
                          .then(updated => resolve(updated))
                          .catch(err => reject(err))
    })
}

/**
 * Обновление по произвольному набору ключей.
 * @param collection {String} Наименование коллекции
 * @param data {Object} удаляемые данные.
 * */
const updateByCustomKeys = (collection, data) => {
    return new Promise((resolve, reject) => {
        models[collection].findOneAndUpdate(data)
                          .then(updated => resolve(updated))
                          .catch(err => reject(err))
    })
}

/**
 * Функция выполняет некоторую комманду с базой данных.
 * @param url {String} Строка запроса к БД
 * @param data {Object} В зависимости от выполняемой комманды этот параметр имеет различные назначения:
 * для комманды вставки - добавляемые данные;
 * для комманды обновления - обновляемые данные:
 * для комманды удаления - удаляемые данные;
 * для комманды выборки - Условие выборки (по id, по custom_keys, выборка нескольких документов)
 * */
const execute = (url, data) => {
    const request = url.split('/')
    switch (request[3]) {
        case api.ACTS.insert: {
            return insert(request[2], data)
        }
        case api.ACTS.remove: {
            return remove(request[2], data)
        }
        case api.ACTS.update: {
            return update(request[2], data)
        }
        case api.ACTS.select: {
            return find(request[2], data)
        }
        default: {
            return new Promise((resolve, reject) => {
                reject({
                    responseCode: 400,
                    message: 'Запрос на несущетвующий ресурс'
                })
            })
        }
    }
}

module.exports = {
    execute,
    init
}
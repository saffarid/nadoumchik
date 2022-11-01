const {HOME} = process.env;

const work_object = require('./work_object')

const mongoose = require('mongoose')
const {v4: uuid} = require('uuid')

const initDataDB = require('./default.js')
const api = require('../api/api_desc')

const winston = require('winston')
const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
    ),
    transports: [
        new winston.transports.File({filename: HOME + '/log/log.txt'})
    ]
})


const models = {}

const runOnObject = (sysDef, sysDb) => {
    Object.keys(sysDef).forEach(((key, index, array) => {
        if (sysDb[key] === undefined || sysDb[key] === null) {
            //Если запись в БД не определена, тупо добавляем всё поле целиком
            sysDb[key] = sysDef[key]
        }
        else {
            //Если запись определена и...
            if (work_object.isObject(sysDb[key])) {
                // и является объектом
                runOnObject(sysDef[key], sysDb[key])
            }
        }
    }))
}

const init = async () => {
    for (const value of Object.values(api.DATABASE.collections)) {
        models[value.name] = mongoose.model(value.name, value.schema);
    }

    for (const key of Object.keys(initDataDB)) {
        const dataFindings = await find(key, api.BODY_REQUEST.termsSampling)
        if (dataFindings.length === 0) {
            await insert(key, initDataDB[key])
        }
    }
}

/**
 * Функция проверяет наличие идентификатора
 * */
const isById = (data) => {
    return (work_object.isObject(data) && ('_id' in data))
}
/**
 * Функция проверяет наличие параметров кол-ва выборки
 * */
const isSampling = (data) => {
    return (work_object.isObject(data) && ('shift' in data) && ('count' in data))
}

/**
 * Функция конвертирует объект с ссылками в "чистый" объект
 * @param obj {Object} конвертируемый объект
 * @param schema {Object} Часть схемы коллекцииконвертируемого объекта
 * */
const convertRefsToClearObj = (schema, obj) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (const key of Object.keys(schema)) {
                if (key === '_id') continue

                //Получаем объект-описание поля документа коллекции
                const desc = schema[key]

                //Определяем содержит описание тип объектаили нет
                if ('type' in desc) {
                    if (!('ref' in desc)) {
                        continue
                    }

                    const term = {
                        _id: obj[key]
                    }
                    const finded = await find(schema[key].ref, term)
                    obj[key] = finded.length != 0 ? finded[0] : {}

                }
                else {
                    obj[key] = await convertRefsToClearObj(schema[key], obj[key])
                }
            }
            resolve(obj)
        }
        catch (e) {
            logger.error([`convertRefsToClearObj`, e])
        }
    })
}

/**
 * Функция конвертирует "чистый" объект в объект с ссылками
 * @param obj {Object} конвертируемый объект
 * @param schema {Object} Часть схемы коллекцииконвертируемого объекта
 * */
const convertClearToRefsObj = (schema, obj) => {
    return new Promise(async (resolve, reject) => {
        try {
            //key - наименование поля в БД
            for (const key of Object.keys(schema)) {
                if (key === '_id') continue
                //Получаем объект-описание поля документа коллекции
                const desc = schema[key]

                //Определяем содержит описание тип объектаили нет
                if ('type' in desc) {
                    if (!('ref' in desc)) {
                        continue
                    }
                    /*
                    * Тот объект, который получим из obj по ключу key, является условием выборки.
                    * Проверим его на наличие поля _id.
                    * Если поле есть выделим его и подставим, иначе найдём в БД объект и определим его идентификатор
                    * */
                    if (work_object.isObject(obj[key]) && '_id' in obj[key]) {
                        obj[key] = obj[key]['_id']
                    }
                    else {
                        obj[key] = (await find(schema[key].ref, obj[key]))[0]
                    }
                }
                else {
                    obj[key] = await convertClearToRefsObj(schema[key], obj[key])
                }
            }
            resolve(obj)
        }
        catch (e) {
            logger.error(['convertClearToRefsObj', e])
        }
    })


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
        return findBySampling(collection)
    }
    else {
        return findAllByCustomKeys(collection, terms)
    }
}

/**
 * Поиск по произвольным ключам.
 * @return массив элементов, удовлетворяющих условиям выборки
 * */
const findAllByCustomKeys = (collection, terms) => {
    return new Promise((resolve, reject) => {
        models[collection].find(terms)
                          .then(async findings => {
                              if (findings == null) {
                                  resolve([])
                                  return
                              }

                              for (let i = 0; i < findings.length; i++) {
                                  findings[i] = await convertRefsToClearObj(api.DATABASE.collections[collection].schema, findings[i])
                              }
                              resolve(findings)
                          })
                          .catch(err => {
                              logger.error(['findAllByCustomKeys', err])
                              reject(err)
                          })
    })
}

/**
 * Поиск по идентификатору.
 * */
const findById = (collection, terms) => {
    return new Promise((resolve, reject) => {
        models[collection].findById(terms._id)
                          .then(async finding => {
                              if (finding == null) {
                                  resolve([])
                                  return
                              }
                              resolve([await convertRefsToClearObj(api.DATABASE.collections[collection].schema, finding)])
                          })
                          .catch(err => {
                              logger.error(['findById', err])
                              reject(err)
                          })
    })
}

/**
 * Поиск всего.
 * @return массив элементов
 * */
const findBySampling = (collection) => {
    return new Promise((resolve, reject) => {
        models[collection].find()
                          .then(async findings => {
                              if (findings.length === 0) {
                                  resolve([])
                                  return
                              }

                              for (let i = 0; i < findings.length; i++) {
                                  findings[i] = await convertRefsToClearObj(api.DATABASE.collections[collection].schema, findings[i])
                              }

                              resolve(findings)
                          })
                          .catch(err => {
                              logger.error(['findBySampling', err])
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
    return new Promise(async (resolve, reject) => {
        data['_id'] = uuid()
        data = await convertClearToRefsObj(api.DATABASE.collections[collection].schema, data)
        models[collection].create(data)
                          .then(value => resolve(value))
                          .catch(err => {
                              logger.error(['insertOne', err])
                              reject(err)
                          })
    })
}

/**
 * @param collection {String}
 * @param data {Array}
 * */
const insertMany = (collection, data) => {
    return new Promise(async (resolve, reject) => {
        const schema = api.DATABASE.collections[collection].schema
        for (let i = 0; i < data.length; i++) {
            data[i]['_id'] = uuid()
            data[i] = await convertClearToRefsObj(schema, data[i])
        }
        models[collection].insertMany(data)
                          .then(value => resolve({
                              ...api.CODES_RESPONSE.created,
                              datas: value
                          }))
                          .catch(err => {
                              logger.error(['insertMany', err])
                              reject(err)
                          })
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
                          .catch(err => {
                              logger.error(['removeById', err])
                              reject(err)
                          })
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
                          .catch(err => {
                              logger.error(['removeByCustomKeys', err])
                              reject(err)
                          })
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
    return new Promise(async (resolve, reject) => {
        data = await convertClearToRefsObj(api.DATABASE.collections[collection].schema, data)
        models[collection].findByIdAndUpdate(data._id, data)
                          .then(updated => resolve(updated))
                          .catch(err => {
                              logger.error(['updateById', err])
                              reject(err)
                          })
    })
}

/**
 * Обновление по произвольному набору ключей.
 * @param collection {String} Наименование коллекции
 * @param data {Object} обновляемые данные.
 * */
const updateByCustomKeys = (collection, data) => {
    return new Promise(async (resolve, reject) => {
        data = await convertClearToRefsObj(api.DATABASE.collections[collection].schema, data)
        models[collection].findOneAndUpdate(data, data)
                          .then(updated => resolve(updated))
                          .catch(err => {
                              logger.error(['updateByCustomKeys', err])
                              reject(err)
                          })
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

const codes = {
    duplicate: 11000
}

module.exports = {
    codes,
    execute,
    init
}
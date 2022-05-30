const initDataDB = require('./default.js')
const api = require('./../../api/api_desc')
const hash = require('jshashes')

const system = require('../system.js')
const roleOfUser = require('../role_of_user_actions.js')
const user = require('../user_actions.js')

const runOnObject = (sysDef, sysDb) => {
    Object.keys(sysDef).forEach(((key, index, array) => {
        if (sysDb[key] === undefined || sysDb[key] === null) {
            //Если запись в БД не определена, тупо добавляем всё поле целиком
            sysDb[key] = sysDef[key]
        } else {
            //Если запись определена и...
            if (sysDb[key] === Object(sysDb[key])) {
                // и является объектом
                runOnObject(sysDef[key], sysDb[key])
            }
        }
    }))
}

const init = () => {
    system.execute(api.ACTS.select, {})
        .then(data => {
            if (data === null) {
                system.execute(api.ACTS.insert, initDataDB.system)
            } else {
                runOnObject(initDataDB.system, data._doc)
                system.execute(api.ACTS.update, data._doc)
                    .then(value => console.log(`Успешно обновлено ${value}`))
                    .catch(err => console.error(err))
            }
        })
        .catch(err => {
            console.error(err)
        })


    Object.keys(initDataDB.roleOfUser).forEach(key => {
        roleOfUser.execute(api.ACTS.select, {name: key})
            .then(data => {
                if (data.length === 0) {
                    roleOfUser.execute(api.ACTS.insert, {name: key})
                } else {
                    //Оформить обновление информации
                }
            })
    })

    initDataDB.users.forEach(value => {
        user.execute(api.ACTS.select, {name: value.name})
            .then(data => {
                console.log(data)
                if (data === null) {
                    roleOfUser.execute(api.ACTS.select, {role: {name: value.role}})
                        .then(role => {
                            user.execute(api.ACTS.insert, {
                                name: value.name,
                                pass: new hash.SHA1().b64(value.pass),
                                role_id: role[0]._id
                            })
                        })
                }
            })
    })

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
    return ((data['shift'] !== undefined)&&(data['length'] !== undefined))
}

const getModel = (collection) => {

}

/**
 * Функиця проводит выборку в коллекции
 * @param collection {String} коллекция, в которой будет проводится поиск документа
 * @param terms {Object} условие выборки.
 * Для выборки по идентификатору - передавать объект вида {_id: some_data};
 * для выборки по кастомному параметру - {custom_key: some_data, ..., custom_key: some_data};
 * для выборки нескольких документов - {shift: начало_выборки, length: кол-во документов},
 * если необходимо получить все возможные объекты, достаточно передать нули {shift: 0, length: 0}.
 */
const find = (collection, terms) => {

}

const findById = (collection, terms) => {
    return new Promise((resolve, reject) => {

    })
}

/**
 * Функиця проводит выборку в коллекции
 * @param collection {String} коллекция, в которой будет проводится поиск документа
 * @param terms {Object} условие выборки.
 * Для выборки по идентификатору - передавать объект вида {_id: some_data};
 * для выборки по кастомному параметру - {custom_key: some_data, ..., custom_key: some_data};
 * для выборки нескольких документов - {shift: начало_выборки, length: кол-во документов},
 * если необходимо получить все возможные объекты, достаточно передать нули {shift: 0, length: 0}.
 */
const insert = (collection, data) => {

}

/**
 * Функция выполняет некоторую комманду с базой данных.
 * @param command {String} Комманда для выполнения БД. Список возможных комманд см. в api.
 * @param collection {String} коллекция, в которой будет проводится поиск документа.
 * @param data {Object} В зависимости от выполняемой комманды этот параметр имеет различные назначения:
 * для комманды вставки - добавляемые данные;
 * для комманды обновления - обновляемые данные:
 * для комманды удаления - удаляемые данные;
 * для комманды выборки - Условие выборки (по id, по custom_keys, выборка нескольких документов)
 * */
const execute = (command, collection, data) => {
}

module.exports = {
    execute,
    init
}
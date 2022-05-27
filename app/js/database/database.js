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
    system.execute(api.ACTS.select, {})
        .then(data => {
            if (data === null) {
                system.execute(api.ACTS.insert, initDataDB.system)
            }
            else {
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
                }
                else {
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

const execute = () => {

}

module.exports = {
    execute,
    init
}
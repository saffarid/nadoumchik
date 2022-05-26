const initDataDB = require('./default.js')
const api = require('./../../api/api_desc')

const system = require('../system.js')

const runOnObject = (sysDef, sysDb) => {
    Object.keys(sysDef).forEach(((key, index, array) => {
        if(sysDb[key] === undefined || sysDb[key] === null){
            //Если запись в БД не определена, тупо добавляем всё поле целиком
            sysDb[key] = sysDef[key]
        } else {
            //Если запись определена и...
            if (sysDb[key] === Object(sysDb[key])){
                // и является объектом
                runOnObject(sysDef[key], sysDb[key])
            }
        }
    }))
}

const init = () => {
    system.execute(api.ACTS.select, {})
        .then(data => {
            if (data === null){
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
}

const execute = () => {

}

module.exports = {
    execute,
    init
}
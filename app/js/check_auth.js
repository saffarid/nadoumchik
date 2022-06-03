const database = require('./database')
const api = require('./../api/api_desc')

const checkAuth = (user) => {
    return new Promise((resolve, reject) => {
        database.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select), user)
            .then(user => {
                if(user.findings.let === 0){
                    reject({
                        message: 'Неверно введёно имя пользователя или пароль.'
                    })
                } else {
                    user.pass = null
                    resolve(user)
                }
            })
    })
}

module.exports = {
    checkAuth
}
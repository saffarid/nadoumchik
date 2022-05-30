const database = require('./database/database')
const api = require('./../api/api_desc')

const checkAuth = (user) => {
    return new Promise((resolve, reject) => {
        database.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select), user)
            .then(user => {
                console.log(user)
                if(user === null){
                    reject({
                        message: 'Неверно введёно имя пользователя или пароль.'
                    })
                } else {
                    database.execute(api.MODEL_REQUESTS.db(api.DATABASE.collections.roleOfUser.name, api.ACTS.select), {_id: user.role_id})
                        .then(role =>
                            resolve(role)
                        )
                }
            })
    })
}

module.exports = {
    checkAuth
}
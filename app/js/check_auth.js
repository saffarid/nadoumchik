const userDb = require('./user_actions.js')
const roleOfUser = require('./role_of_user_actions.js')
const api = require('./../api/api_desc')

const checkAuth = (user) => {
    return new Promise((resolve, reject) => {
        userDb.execute(api.ACTS.select, user)
            .then(user => {
                console.log(user)
                if(user === null){
                    reject({
                        message: 'Неверно введёно имя пользователя или пароль.'
                    })
                } else {
                    roleOfUser.execute(api.ACTS.select, {_id: user.user.role_id})
                        .then(role =>
                            resolve(role[0])
                        )
                }
            })
    })
}

const findById = () => {
    return new Promise((resolve, reject) => {

    })
}

module.exports = {
    checkAuth
}
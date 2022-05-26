const mongoose = require('mongoose')
const api = require('../api/api_desc')

const execute = (url, data) => {
    if (url.includes(api.ACTS.insert)) {
        insert()
    } else if (url.includes(api.ACTS.remove)) {
        remove()
    } else if (url.includes(api.ACTS.update)) {

    } else if (url.includes(api.ACTS.select)) {

    } else {
        return {
            responseCode:400,
            message: 'Запрос на несущетвующий ресурс'
        }
    }
}

const insert = (data) => {

}

const remove = () => {

}

const update = () => {

}

const select = () => {

}

module.exports = {
    execute
}
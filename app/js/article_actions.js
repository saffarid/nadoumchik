const mongoose = require('mongoose')
const api = require('../api/api_desc')

/**
 * @param url {String}
 * @param data {json}
 * @param res {Response}
 * @return  {json}
 * */
const execute = (url, data) => {
    if (url.includes(api.ACTS.insert)) {
        return insert()
    } else if (url.includes(api.ACTS.remove)) {
        return remove()
    } else if (url.includes(api.ACTS.update)) {
        return  update()
    } else if (url.includes(api.ACTS.select)) {
        return select()
    } else {
        return {
            responseCode:400,
            message: 'Запрос на несущетвующий ресурс'
        }
    }
}

const insert = (data) => {
    console.log('insert')
}

const remove = () => {
    console.log('remove')
}

const update = () => {
    console.log('update')
}

const select = () => {
    console.log('select')
}

module.exports = {
    execute
}
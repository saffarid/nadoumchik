const api = require('../api/api_desc')
const {v4: uuid} = require('uuid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const systemSchema = new Schema({
    /**
     * uuid статьи
     * */
    _id: {
        type: String,
        required: true
    },
    /**
     * Рекламный блок
     * */
    ads: {
        /**
         * Флаг отображения рекламы
         * */
        isShowingAds: {
            type: Boolean,
            required: true
        }
    }
})
const SystemModel = mongoose.model("System", systemSchema)

/**
 * @param url {String}
 * @param data {json|Object}
 * @param res {Response}
 * */
const execute = (url, data) => {
    if (url.includes(api.ACTS.insert)) {
        return insert(data)
    }
    else if (url.includes(api.ACTS.remove)) {
        return remove(data)
    }
    else if (url.includes(api.ACTS.update)) {
        return update(data)
    }
    else if (url.includes(api.ACTS.select)) {
        return select(data)
    }
    else {
        // res.json({
        //     responseCode: 400,
        //     message: 'Запрос на несущетвующий ресурс'
        // })
    }
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const insert = (data) => {
    console.log('insert')
    console.log(data)

    SystemModel.find()
        .then(readData => {
            // if (data !== null) {
            //     return update(data)
            // }

            return new Promise((resolve, reject) => {
                const system = new SystemModel({
                    _id: uuid(),
                    ads: data.ads,
                })
                system.save()
                    .then(value => resolve(value))
                    .catch(err => reject(err))
            })
        })
        .catch(err => {
            console.log(err)
        })
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const remove = (data) => {
    console.log('remove')
    console.log(data)
    return new Promise((resolve, reject) => {
        reject({
            responseCode: 400,
            message: 'Функция не поддерживается'
        })
    })
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const update = (data) => {
    console.log('update')
    console.log(data)
    return new Promise((resolve, reject) => {
        SystemModel.findByIdAndUpdate(data._id, data)
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const select = (data) => {
    console.log('select')
    return new Promise((resolve, reject) => {
        SystemModel.findOne({})
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

module.exports = {
    execute
}
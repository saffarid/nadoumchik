const api = require('../api/api_desc')
const {v4: uuid} = require('uuid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const themeSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    }
})
const ThemeModel = mongoose.model(api.DATABASE.collections.themesOfPublication, themeSchema)

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
        // return {
        //     responseCode: 400,
        //     message: 'Запрос на несущетвующий ресурс'
        // }
    }
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const insert = (data) => {
    /*
    * Перед вставкой новой темы в БД, проверяем не будет ли в БД дубликатов тем
    * */
    return new Promise((resolve, reject) => {
        ThemeModel.findOne({value: data.value})
            .then(doc => {
                if (doc !== null) {
                    console.log('Объект дублирует уже существующий')
                    reject({
                        responseCode: 400,
                        message: 'Объект дублирует уже существующий'
                    })
                }
                else {
                    const category = new ThemeModel({
                        _id: uuid(),
                        value: data.value
                    })
                    category.save()
                        .then(value => resolve(value))
                        .catch(err => reject(err))
                }
            })
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
        ThemeModel.findByIdAndDelete(data._id)
            .then(value => resolve(value))
            .catch(err => reject(err))
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
        ThemeModel.findOne({value: data.value})
            .then(doc => {
                if (doc !== null) {
                    console.log('Объект дублирует уже существующий')
                    reject({
                        responseCode: 400,
                        message: 'Объект дублирует уже существующий'
                    })
                }
                else {
                    ThemeModel.findByIdAndUpdate(data._id, data)
                        .then(value => resolve(value))
                        .catch(err => reject(err))
                }
            })
    })
}

/**
 * @param data {json|Object}
 * */
const select = (data) => {
    return new Promise((resolve, reject) => {
        ThemeModel.find({})
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

module.exports = {
    execute
}
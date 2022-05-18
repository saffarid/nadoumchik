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
const ThemeModel = mongoose.model("themesOfPublication", themeSchema)

/**
 * @param url {String}
 * @param data {json|Object}
 * @param res {Response}
 * */
const execute = (url, data, res) => {
    if (url.includes(api.ACTS.insert)) {
        insert(data, res)
    } else if (url.includes(api.ACTS.remove)) {
        remove(data, res)
    } else if (url.includes(api.ACTS.update)) {
        update(data, res)
    } else if (url.includes(api.ACTS.select)) {
        select(data, res)
    } else {
        return {
            responseCode: 400,
            message: 'Запрос на несущетвующий ресурс'
        }
    }
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const insert = (data, res) => {

    /*
    * Перед вставкой новой темы в БД, проверяем не будет ли в БД дубликатов тем
    * */
    ThemeModel.findOne({value: data.value})
        .then(doc => {
            if (doc !== null) {
                console.log('Объект дублирует уже существующий')
                res.json({
                    responseCode: 400,
                    message: 'Объект дублирует уже существующий'
                })
            } else {
                new Promise((resolve, reject) => {

                    const category = new ThemeModel({
                        _id: uuid(),
                        value: data.value
                    })
                    category.save()
                        .then(value => resolve(value))
                        .catch(err => reject(err))
                })
                    .then(data => {
                        console.log('Объект успешно добавлен')
                        console.log(data)
                        res.json({
                            responseCode: 200,
                            message: 'Объект добавлен'
                        })
                    })
                    .catch((err) => {
                        console.log('Объект не добавлен')
                        res.json({
                            responseCode: 400,
                            message: 'Объект не добавлен',
                            err: err
                        })
                    })
            }
        })
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const remove = (data, res) => {
    console.log('remove')
    console.log(data)
    new Promise((resolve, reject) => {
        ThemeModel.findByIdAndDelete(data._id)
            .then(value => resolve(value))
            .catch(err => reject(err))
    }).then(data => {
        console.log('Объект успешно обновлён')
        console.log(data)
        res.json({
            responseCode: 200,
            message: 'Объект удалён'
        })
    }).catch(data => {
        console.log('Объект не обновлён')
        res.json({
            responseCode: 400,
            message: 'Объект не обновлён'
        })
    })
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const update = (data, res) => {
    console.log('update')
    console.log(data)


    ThemeModel.findOne({value: data.value})
        .then(doc => {
            if (doc !== null) {
                console.log('Объект дублирует уже существующий')
                res.json({
                    responseCode: 400,
                    message: 'Объект дублирует уже существующий'
                })
            } else {
                new Promise((resolve, reject) => {
                    ThemeModel.findByIdAndUpdate(data._id, data)
                        .then(value => resolve(value))
                        .catch(err => reject(err))
                })
                    .then(value => {
                        console.log('Объект успешно обновлён')
                        console.log(value)
                        res.json({
                            responseCode: 200,
                            message: 'Объект обновлён'
                        })
                    })
                    .catch(err => {
                        console.log('Объект не обновлён')
                        console.log(err)
                        res.json({
                            responseCode: 400,
                            message: 'Объект не обновлён'
                        })
                    })
            }
        })
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const select = (data, res) => {
    new Promise((resolve, reject) => {
        ThemeModel.find({})
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
        .then(data => {
            res.json(data)
        })
        .catch(err => {
            console.log('Выборка не удалась')
            res.json({
                responseCode: 400,
                message: 'Выборка не удалась',
                err: err
            })
        })
}

module.exports = {
    execute
}
const api = require('../api/api_desc')
const {v4: uuid} = require('uuid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const systemSchema = new Schema({
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
const execute = (url, data, res) => {
    if (url.includes(api.ACTS.insert))
    {
        insert(data, res)
    }
    else if (url.includes(api.ACTS.remove))
    {
        remove(data, res)
    }
    else if (url.includes(api.ACTS.update))
    {
        update(data, res)
    }
    else if (url.includes(api.ACTS.select))
    {
        select(data, res)
    }
    else
    {
        res.json({
            responseCode: 400,
            message: 'Запрос на несущетвующий ресурс'
        })
    }
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const insert = (data, res) => {
    console.log('insert')
    console.log(data)

    SystemModel.find()
        .then(data => {
            if (data !== null){
                update(data, res)
            }

            new Promise((resolve, reject) => {
                const system = new SystemModel({
                    ads: data.ads,
                })
                system.save()
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
                .catch(err => {
                    console.log('Объект не добавлен')
                    res.json({
                        responseCode: 400,
                        message: 'Объект не добавлен',
                        err: err
                    })
                })
        })
        .catch(err => {
            console.log(err)
        })

    new Promise((resolve, reject) => {

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
            console.log(err)
            res.json({
                responseCode: 400,
                message: 'Объект не добавлен',
                err: err
            })
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
    })
        .then(data => {
        console.log('Объект успешно обновлён')
        console.log(data)
        res.json({
            responseCode: 200,
            message: 'Объект удалён'
        })
    })
        .catch(data => {
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
    new Promise((resolve, reject) => {
        SystemModel.updateOne({}, data)
            .then(data => resolve(data))
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

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const select = (data, res) => {
    console.log('select')
    new Promise((resolve, reject) => {
    })
        .then(data => {
        res.json(data)
    })
        .catch(data => {
        console.log('Выборка не удалась')
        res.json({
            responseCode: 400,
            message: 'Выборка не удалась',
            err: data
        })
    })
}

module.exports = {
    execute
}
const api = require('../api/api_desc')
const {v4: uuid} = require('uuid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = new Schema({
    /**
     * uuid статьи
     * */
    _id: String,
    /**
     * Тип статьи, в это полу устанавливается идентификатор из коллекции typesOfArticles
     * */
    type: String,
    /**
     * Заголовок статьи
     * */
    title: String,
    /**
     * Основное содержимое статьи
     * */
    content: String,
    /**
     * Дата создания статьи
     * */
    dateStamp: Date,
    /**
     * Кол-во лайков
     * */
    likes: Number,
    /**
     * Кол-во дизлайков
     * */
    dislikes: Number,
    /**
     * Кол-во просмотров
     * */
    views: Number
})
const ArticleModel = mongoose.model("Article", articleSchema)
/**
 * @param url {String}
 * @param data {json|Object}
 * @param res {Response}
 * */
const execute = (url, data, res) => {
    if (url.includes(api.ACTS.insert)) {
        insert(data, res)
    } else if (url.includes(api.ACTS.remove)) {
        remove()
    } else if (url.includes(api.ACTS.update)) {
        update()
    } else if (url.includes(api.ACTS.select)) {
        select(data, res)
    } else {
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
    new Promise((resolve, reject) => {
        const article = new ArticleModel({
            _id: uuid(),
            title: data.title,
            content: data.content,
            dateStamp: new Date(),
        })
        article.save()
            .then(value => {
                resolve(value)
            })
            .catch(err => {
                reject()
            })
    })
        .then(data => {
            console.log('Объект успешно добавлен')
            console.log(data)
            res.json({
                responseCode: 200,
                message: 'Объект добавлен'
            })
        })
        .catch((data) => {
            console.log('Объект не добавлен')
            console.log(data)
            res.json({
                responseCode: 400,
                message: 'Объект не добавлен'
            })
        })

}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const remove = () => {
    console.log('remove')
    new Promise((resolve, reject) => {

    }).then(data => {

    }).catch(data => {

    })
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const update = () => {
    console.log('update')
    new Promise((resolve, reject) => {

    }).then(data => {

    }).catch(data => {

    })
}

/**
 * @param data {json|Object}
 * @param res {Response}
 * */
const select = (data, res) => {
    console.log('select')
    new Promise((resolve, reject) => {
        ArticleModel.find({})
            .then(docs => {
                try {
                    let result = null
                    console.log(data)
                    docs = docs.reverse()
                    if (data.shift > docs.length) throw new Error('Nothing return')
                    const range = data.shift + data.count
                    if (range < docs.length){
                        result = docs.slice(data.shift, range)
                    } else {
                        result = docs.slice(data.shift, docs.length)
                    }
                     console.log(result)


                    resolve({
                        articles: result
                    })
                } catch (e) {
                    reject(e)
                }
            })
            .catch(err => {
                reject(err)
            })
    }).then(data => {
        res.json(data)
    }).catch(data => {
        console.log('Выборка не удалась')
        console.log(data)
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
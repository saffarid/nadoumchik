const api = require('../api/api_desc')
const {v4: uuid} = require('uuid')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const publicationSchema = new Schema({
    /**
     * uuid статьи
     * */
    _id: {
        type: String,
        required: true
    },
    /**
     * Дата создания статьи
     * */
    dateStamp: {
        type: Date,
        required: true
    },
    /**
     * Кол-во лайков
     * */
    likes: {
        type: Number,
        required: false
    },
    /**
     * Кол-во дизлайков
     * */
    dislikes: {
        type: Number,
        required: false
    },
    /**
     * Кол-во просмотров
     * */
    views: {
        type: Number,
        required: false
    },
    /**
     * Содержимое публикации
     * */
    content: {
        /**
         * Тип статьи, в это полу устанавливается идентификатор из коллекции typesOfArticles
         * */
        type: {
            type: String,
            required: false
        },
        /**
         * Заголовок статьи
         * */
        title: {
            type: String,
            required: true
        },
        /**
         * Основное содержимое статьи
         * */
        content: {
            type: String,
            required: true
        },
    },
    /**
     * Внешнее отображение предпросмотра публикации
     * */
    preview: {
        /**
         * Флаг положения изображения
         * */
        imgOnLeft: {
            type: Boolean,
            required: true
        },
        /**
         * Цвет фона
         * */
        backgroundColor: {
            type: String,
            required: true
        },
        /**
         * Цвет текста
         * */
        textColor: {
            type: String,
            required: true
        },
        /**
         * Изображение предпросмотра
         * */
        image: {
            type: String,
            required: true
        },
    },
    /**
     * Внешнее отображение предпросмотра публикации
     * */
    view: {
        title: {
            useImage: {
                type: Boolean,
                required: true,
                default: false
            },
            height: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: false
            },
            text: {
                textColor: {
                    type: String,
                    required: true
                },
                fontFamily: {
                    type: String,
                    required: true
                },
                fontWeight: {
                    type: Number,
                    required: true
                },
                fontStyle: {
                    type: String,
                    required: true
                }
            },
            blur: {
                size: {
                    type: Number,
                    required: false
                },
                blur: {
                    type: Number,
                    required: false
                },
                position_y: {
                    type: Number,
                    required: false
                }
            },
            clear: {
                size: {
                    type: Number,
                    required: false
                },
                position_y: {
                    type: Number,
                    required: false
                }
            }
        },
    }
})
const PublicationModel = mongoose.model("Article", publicationSchema)

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
  * */
const insert = (data) => {
    console.log('insert')
    console.log(data)
    return new Promise((resolve, reject) => {
        const article = new PublicationModel({
            _id: uuid(),
            dateStamp: new Date(),
            content: data.content,
            preview: data.preview,
            view: data.view,
        })
        article.save()
            .then(value => {
                resolve(value)
            })
            .catch(err => {
                reject(err)
            })
    })
}

/**
 * @param data {json|Object}
  * */
const remove = (data) => {
    console.log('remove')
    console.log(data)
    return new Promise((resolve, reject) => {
        PublicationModel.findByIdAndDelete(data._id)
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

/**
 * @param data {json|Object}
  * */
const update = (data) => {
    console.log('update')
    console.log(data)
    return new Promise((resolve, reject) => {
        PublicationModel.findByIdAndUpdate(data._id, data)
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

/**
 * @param data {json|Object}
  * */
const select = (data) => {
    console.log('select')
    return new Promise((resolve, reject) => {
        PublicationModel.find({})
            .then(docs => {
                try {
                    let result = null
                    console.log(data)
                    docs = docs.reverse()
                    if (data.shift > docs.length) throw new Error('Nothing return')
                    const range = data.shift + data.count
                    if (range < docs.length) {
                        resolve({
                            articles: docs.slice(data.shift, range),
                            thereIsMore: true
                        })
                    }
                    else {
                        resolve({
                            articles: docs.slice(data.shift, docs.length),
                            thereIsMore: false
                        })
                    }
                    console.log(result)

                } catch (e) {
                    reject(e)
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}

module.exports = {
    execute
}
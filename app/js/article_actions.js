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
    new Promise((resolve, reject) => {
        const article = new PublicationModel({
            _id: uuid(),
            dateStamp: new Date(),
            content: data.content,
                // {
                // type: data.content.type,
                // title: data.content.title,
                // content: data.content.content,
            // },
            preview: data.preview,
                // {
                // imgOnLeft: data.preview.imgOnLeft,
                // backgroundColor: data.preview.backgroundColor,
                // textColor: data.preview.textColor,
                // image: data.preview.image
            // },
            view: data.view,
                // {
                // title: {
                //     useImage: data.view.title.useImage,
                //     height: data.view.title.height,
                //     image: data.view.title.image,
                //     text: data.view.title.text,
                    // text: {
                    //     textColor: data.view.title.text.textColor,
                    //     fontFamily: data.view.title.text.fontFamily,
                    //     fontWeight: data.view.title.text.fontWeight,
                    //     fontStyle: data.view.title.text.fontStyle
                    // },
                    // blur: data.view.title.blur,
                    // blur: {
                    //     size: data.view.title.blur.size,
                    //     blur: data.view.title.blur.blur,
                    //     position_y: data.view.title.blur.position_y
                    // },
                    // clear: data.view.title.clear,
                    // clear: {
                    //     size: data.view.title.clear.size,
                    //     position_y: data.view.title.clear.position_y
                    // }
                // }
            // }
        })
        article.save()
            .then(value => {
                resolve(value)
            })
            .catch(err => {
                reject(err)
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
        PublicationModel.findByIdAndDelete(data._id)
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
    new Promise((resolve, reject) => {
        PublicationModel.findByIdAndUpdate(data._id, data)
            .then(value => resolve(value))
            .catch(err => reject(err))
    }).then(value => {
        console.log('Объект успешно обновлён')
        console.log(value)
        res.json({
            responseCode: 200,
            message: 'Объект обновлён'
        })
    }).catch(err => {
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
        PublicationModel.find({})
            .then(docs => {
                try {
                    let result = null
                    console.log(data)
                    docs = docs.reverse()
                    if (data.shift > docs.length) throw new Error('Nothing return')
                    const range = data.shift + data.count
                    if (range < docs.length) {
                        // result = docs.slice(data.shift, range)
                        resolve({
                            articles: docs.slice(data.shift, range),
                            thereIsMore: true
                        })
                    } else {
                        // result = docs.slice(data.shift, docs.length)
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
    }).then(data => {
        res.json(data)
    }).catch(data => {
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
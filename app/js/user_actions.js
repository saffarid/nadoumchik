const mongoose = require('mongoose')
const {v4: uuid} = require('uuid')
const api = require('../api/api_desc')

const Schema = mongoose.Schema

const userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    user: {
        name: {
            type: String,
            required: true
        },
        pass: {
            type: String,
            required: true
        },
        role_id: {
            type: String,
            required: true
        }
    }

})
const UserModel = mongoose.model(api.DATABASE.collections.users, userSchema)


/**
 * @param url {String}
 * @param data {json|Object}
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

const insert = (data) => {
    return new Promise((resolve, reject) => {
        const newUser = new UserModel({
            _id: uuid(),
            user: data
        })
        newUser.save()
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

const remove = (data) => {
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndDelete(data._id)
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

const update = (data) => {
    return new Promise((resolve, reject) => {
        UserModel.findByIdAndUpdate(data._id, data)
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

const select = (data) => {
    return new Promise((resolve, reject) => {
        console.log({
            user: data
        })
        UserModel.findOne(data)
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

module.exports = {
    execute
}
const mongoose = require('mongoose')
const api = require('../api/api_desc')
const {v4: uuid} = require('uuid')

const Schema = mongoose.Schema

const roleOfUserSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    role:{
        name:{
            type: String,
            required: true
        }
    }

})
const RoleModel = mongoose.model(api.DATABASE.collections.roleOfUser, roleOfUserSchema)

const execute = (url, data) => {
    if (url.includes(api.ACTS.insert)) {
        return insert(data)
    } else if (url.includes(api.ACTS.remove)) {
        return remove(data)
    } else if (url.includes(api.ACTS.update)) {
        return  update(data)
    } else if (url.includes(api.ACTS.select)) {
        return select(data)
    } else {
        // return {
        //     responseCode:400,
        //     message: 'Запрос на несущетвующий ресурс'
        // }
    }
}

const insert = (data) => {
    return new Promise((resolve, reject) => {
        const role = new RoleModel({
            _id: uuid(),
            role: data
        })
        role.save()
            .then(data => resolve(data))
            .catch(err => reject(err))
    })
}

const remove = (data) => {
    return new Promise((resolve, reject) => {
        RoleModel.findByIdAndDelete(data._id)
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

const update = (data) => {
    return new Promise((resolve, reject) => {
        RoleModel.findByIdAndUpdate(data._id, data)
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

const select = (data) => {
    return new Promise((resolve, reject) => {
        RoleModel.find(data)
            .then(value => resolve(value))
            .catch(err => reject(err))
    })
}

module.exports = {
    execute
}
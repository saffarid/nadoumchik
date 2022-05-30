// const api = require('../api/api_desc')
// const {v4: uuid} = require('uuid')
// const mongoose = require('mongoose')
// const Schema = mongoose.Schema
//
// const PublicationModel = mongoose.model(
//     api.DATABASE.collections.publications.name,
//     new Schema(api.DATABASE.collections.publications.schema)
// )
//
// /**
//  * @param url {String}
//  * @param data {json|Object}
//  * */
// const execute = (url, data) => {
//     if (url.includes(api.ACTS.insert)) {
//         return insert(data)
//     }
//     else if (url.includes(api.ACTS.remove)) {
//         return remove(data)
//     }
//     else if (url.includes(api.ACTS.update)) {
//         return update(data)
//     }
//     else if (url.includes(api.ACTS.select)) {
//         return select(data)
//     }
//     else {
//         // res.json({
//         //     responseCode: 400,
//         //     message: 'Запрос на несущетвующий ресурс'
//         // })
//     }
// }
//
// /**
//  * @param data {json|Object}
//   * */
// const insert = (data) => {
//     console.log('insert')
//     console.log(data)
//     return new Promise((resolve, reject) => {
//         const article = new PublicationModel({
//             _id: uuid(),
//             dateStamp: new Date(),
//             content: data.content,
//             preview: data.preview,
//             view: data.view,
//         })
//         article.save()
//             .then(value => {
//                 resolve(value)
//             })
//             .catch(err => {
//                 reject(err)
//             })
//     })
// }
//
// /**
//  * @param data {json|Object}
//   * */
// const remove = (data) => {
//     console.log('remove')
//     console.log(data)
//     return new Promise((resolve, reject) => {
//         PublicationModel.findByIdAndDelete(data._id)
//             .then(value => resolve(value))
//             .catch(err => reject(err))
//     })
// }
//
// /**
//  * @param data {json|Object}
//   * */
// const update = (data) => {
//     console.log('update')
//     console.log(data)
//     return new Promise((resolve, reject) => {
//         PublicationModel.findByIdAndUpdate(data._id, data)
//             .then(value => resolve(value))
//             .catch(err => reject(err))
//     })
// }
//
// /**
//  * @param data {json|Object}
//   * */
// const select = (data) => {
//     console.log('select')
//     return new Promise((resolve, reject) => {
//         PublicationModel.find({})
//             .then(docs => {
//                 try {
//                     let result = null
//                     console.log(data)
//                     docs = docs.reverse()
//                     if (data.shift > docs.length) throw new Error('Nothing return')
//                     const range = data.shift + data.count
//                     if (range < docs.length) {
//                         resolve({
//                             publications: docs.slice(data.shift, range),
//                             thereIsMore: true
//                         })
//                     }
//                     else {
//                         resolve({
//                             publications: docs.slice(data.shift, docs.length),
//                             thereIsMore: false
//                         })
//                     }
//                     console.log(result)
//
//                 } catch (e) {
//                     reject(e)
//                 }
//             })
//             .catch(err => {
//                 reject(err)
//             })
//     })
// }
//
// module.exports = {
//     execute
// }
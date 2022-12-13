const database = require('./database')
const api = require('./../api/api_desc')

let isInit = true

let storage = {
    accessRights: {},
    groups: {},
    users: {},
    themesOfPublication: {},
    publications: []
}

const getPublications = async (skip, limit) => {
    const localPublications = []
    const _skip = skip ?? 0
    const _limit = limit ?? 0

    if (_skip + _limit > storage.publications.length) {
        localPublications.push(...(await requestPublications(Object.values(storage.publications).length)))
    }

    return [...(storage.publications.slice( _skip , _skip + _limit )), ...localPublications]
}
const getThemes = () => storage.themesOfPublication
const getAccessRights = () => storage.accessRights
const getGroups = () => storage.groups
const getUsers = () => storage.users

const requestPublications = async (skip) => {
    const localPublications = []
    const publications = await database.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.select),
        {
            skip: skip,
            limit: 50,
            sort: {dateStamp: -1},
        })
    for (const publication of publications) {
        publication.author = storage.users[publication.author]
        publication.theme.major = publication.theme.major != '-1' ? storage.themesOfPublication[publication.theme.major] : publication.theme.major
        publication.theme.minor = publication.theme.minor != '-1' ? storage.themesOfPublication[publication.theme.minor] : publication.theme.minor
        localPublications.push(publication)
    }
    return localPublications
}

const readData = () => {
    database.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.select)
    )
        .then(async resolve => {

            const change = resolve[0].change

            if (needRead(change.accessRights)) {
                const _access = {}
                const accessRights = await database.execute(
                    api.MODEL_REQUESTS.db(api.DATABASE.collections.accessRights.name, api.ACTS.select)
                )
                for (const accessRight of accessRights) {
                    _access[accessRight._id] = accessRight
                }
                storage.accessRights = _access
                change.accessRights = false
            }

            if (needRead(change.groups)) {
                const _groups = {}
                const groups = await database.execute(
                    api.MODEL_REQUESTS.db(api.DATABASE.collections.groups.name, api.ACTS.select)
                )
                for (const group of groups) {
                    for (const rightKey of Object.keys(group.rights)) {
                        if (group.rights[rightKey] in storage.accessRights) {
                            group.rights[rightKey] = storage.accessRights[group.rights[rightKey]]
                        }
                    }
                    _groups[group._id] = group
                }
                storage.groups = _groups
                change.groups = false
            }

            if (needRead(change.users)) {
                const _users = {}
                const users = await database.execute(
                    api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select)
                )
                for (const user of users) {
                    if (user.group in storage.groups) {
                        user.group = storage.groups[user.group]
                        delete user.auth
                        _users[user._id] = user
                    }
                }
                storage.users = _users
                change.users = false
            }

            if (needRead(change.themesOfPublication)) {
                const _themes = {}
                const themes = await database.execute(
                    api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.select)
                )
                for (const theme of themes) {
                    _themes[theme._id] = theme
                }
                storage.themesOfPublication = _themes
                change.themesOfPublication = false
            }

            if (needRead(change.publications)) {
                let noMore = false
                const _publications = []
                while (_publications.length < 500 && !noMore) {
                    const _publ = await requestPublications(_publications.length)
                    if (_publ.length < 50) noMore = true
                    _publications.push(..._publ)
                }
                storage.publications = _publications
                change.publications = false
            }

            isInit = false

            let hasChangeDatabase
            for (const needFlag of Object.values(change)) {
                if (hasChangeDatabase == undefined) {
                    hasChangeDatabase = needFlag
                } else {
                    hasChangeDatabase = hasChangeDatabase && needFlag
                }
                if (!hasChangeDatabase) break
            }

            if (!hasChangeDatabase) {
                database.execute(
                    api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.update),
                    {
                        filter: {_id: resolve[0]._id},
                        data: {change: change}
                    }
                )
            }

            setTimeout(readData, getTime())
        })
}

/**
 * Функция определяет нужно читать/перечитывать коллекцию или нет
 * */
const needRead = (needRead) => isInit || needRead

const getTime = () => {
    const currentTime = new Date()
    const updateTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1)

    return (updateTime.getTime() - currentTime.getTime())
}

module.exports = {
    getPublications,
    getThemes,
    getAccessRights,
    getGroups,
    getUsers,
    readData
}
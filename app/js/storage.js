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
    let publications
    const localPublications = []
    const _skip = skip ?? 0
    const _limit = limit ?? 0

    if (_skip + _limit > storage.publications.length) {
        publications = await database.execute(
            api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.select),
            {
                skip: Object.values(storage.publications).length,
                limit: 50,
                sort: {dateStamp: -1},
            })
        for (const publication of publications) {
            publication.author = storage.users[publication.author]
            publication.theme.major = publication.theme.major != '-1' ? storage.themesOfPublication[publication.theme.major] : publication.theme.major
            publication.theme.minor = publication.theme.minor != '-1' ? storage.themesOfPublication[publication.theme.minor] : publication.theme.minor
            localPublications.push(publication)
        }
    }

    return [...(storage.publications.slice( _skip , _skip + _limit )), ...localPublications]
}
const getThemes = () => storage.themesOfPublication
const getAccessRights = () => storage.accessRights
const getGroups = () => storage.groups
const getUsers = () => storage.users

const readData = () => {
    database.execute(
        api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.select)
    )
            .then(async response => {
                const localStorage = {
                    accessRights: {},
                    groups: {},
                    users: {},
                    themesOfPublication: {},
                    publications: []
                }
                const change = response[0].change

                if (needRead(change.accessRights)) {
                    const accessRights = await database.execute(
                        api.MODEL_REQUESTS.db(api.DATABASE.collections.accessRights.name, api.ACTS.select)
                    )
                    for (const accessRight of accessRights) {
                        localStorage.accessRights[accessRight._id] = accessRight
                    }
                    change.accessRights = false
                }

                if (needRead(change.groups)) {
                    const groups = await database.execute(
                        api.MODEL_REQUESTS.db(api.DATABASE.collections.groups.name, api.ACTS.select)
                    )
                    for (const group of groups) {
                        for (const rightKey of Object.keys(group.rights)) {
                            if (group.rights[rightKey] in localStorage.accessRights) {
                                group.rights[rightKey] = localStorage.accessRights[group.rights[rightKey]]
                            }
                        }
                        localStorage.groups[group._id] = group
                    }
                    change.groups = false
                }

                if (needRead(change.users)) {
                    const users = await database.execute(
                        api.MODEL_REQUESTS.db(api.DATABASE.collections.users.name, api.ACTS.select)
                    )
                    for (const user of users) {
                        if (user.group in localStorage.groups) {
                            user.group = localStorage.groups[user.group]
                        }
                        delete user.auth
                        localStorage.users[user._id] = user
                    }
                    change.users = false
                }

                if (needRead(change.themesOfPublication)) {
                    const themes = await database.execute(
                        api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.select)
                    )
                    for (const theme of themes) {
                        localStorage.themesOfPublication[theme._id] = theme
                    }
                    change.themesOfPublication = false
                }

                if (needRead(change.publications)) {
                    let noMore = false
                    while (Object.values(localStorage.publications).length < 500 && !noMore) {
                        const publications = await database.execute(
                            api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.select),
                            {
                                skip: Object.values(localStorage.publications).length,
                                limit: 50,
                                sort: {dateStamp: -1},
                            })
                        if (publications.length < 50) noMore = true
                        for (const publication of publications) {
                            publication.author = localStorage.users[publication.author]
                            publication.theme.major = publication.theme.major != '-1' ? localStorage.themesOfPublication[publication.theme.major] : publication.theme.major
                            publication.theme.minor = publication.theme.minor != '-1' ? localStorage.themesOfPublication[publication.theme.minor] : publication.theme.minor
                            localStorage.publications.push(publication)
                        }
                    }
                    change.publications = false
                }

                isInit = false
                storage = localStorage

                let hasChangeDatabase
                for (const needFlag of Object.values(change)) {
                    if (hasChangeDatabase == undefined) {
                        hasChangeDatabase = needFlag
                    }
                    else {
                        hasChangeDatabase = hasChangeDatabase && needFlag
                    }
                    if (!hasChangeDatabase) break
                }

                if (!hasChangeDatabase) {
                    database.execute(
                        api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.update),
                        {
                            filter: {_id: response[0]._id},
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
    getpublications: getPublications,
    getThemes,
    getAccessRights,
    getGroups,
    getUsers,
    readData
}
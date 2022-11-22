import Vuex                              from 'vuex'
import {asyncRequest, setUser, storages} from "@/js/web";
import api                               from "../../../../app/api/api_desc.js"

export const store = new Vuex.Store({
    state: {
        drafts: {},
        publications: {},
        themesOfPublication: {},

        user: null,
        responseMessage: '',

        users: {},
        groups: {},

        system: {}
    },
    getters: {

        /* ---------- Draft ---------- */

        drafts: state => terms => {
            if (Object.keys(state.drafts).length == 0) {
                store.dispatch('loadDraft', terms)
            }
            return state.drafts
        },
        draftsById: state => (id) => {
            return state.publications[id]
        },

        /* ---------- Publications ---------- */

        newPublications: state => Object.values(state.publications).slice(0, 4),
        otherPublications: state => Object.values(state.publications).slice(4, Object.values(state.publications).length),
        publications: (state) => (terms = undefined) => {
            if (Object.keys(state.publications).length == 0) {
                if (terms == undefined) {
                    terms = {
                        shift: 0,
                        count: 10,
                    }
                }
                else {
                    terms['shift'] = 0
                    terms['count'] = 10
                }
                store.dispatch('loadPublication', terms)
            }
            return state.publications
        },
        publicationById: state => (id) => {
            return state.publications[id]
        },

        /* ---------- Themes ---------- */

        themesOfPublication: state => {
            if (Object.keys(state.themesOfPublication).length == 0) {
                store.dispatch('loadThemes')
            }
            return state.themesOfPublication
        },

        /* ---------- System ---------- */

        system: state => state.system,

        /* ---------- Users ---------- */

        user: state => state.user,
        groups: state => state.groups,
        users: state => state.users,


        responseMessage: state => state.responseMessage,
    },
    mutations: {
        /* ---------- Draft ---------- */

        addDrafts: (state, payload) => {
            for (const p of payload) {
                state.drafts[p._id] = p
            }
        },
        addDraft: (state, payload) => state.drafts[payload._id] = payload,
        removeDraft: (state, payload) => delete state.drafts[payload],

        /* ---------- Publications ---------- */

        addPublications: (state, payload) => {
            for (const p of payload) {
                state.publications[p._id] = p
            }
        },
        addPublication: (state, payload) => state.publications[payload._id] = payload,
        removePublication: (state, payload) => delete state.publications[payload],

        /* ---------- Themes ---------- */

        addThemes: (state, payload) => {
            let themesOfPublication = payload
            themesOfPublication.sort((theme1, theme2) => {
                return theme1.value.localeCompare(theme2.value)
            })
            for (const themes of themesOfPublication) {
                state.themesOfPublication[themes._id] = themes
            }
        },

        /* ---------- Users ---------- */

        addGroups: (state, payload) => {
            for (const p of payload) {
                state.groups[p._id] = p
            }
        },
        addUsers: (state, payload) => {
            for (const p of payload) {
                state.users[p._id] = p
            }
        },

        setGroup: (state, payload) => state.groups[payload._id] = payload,
        setUser: (state, payload) => state.user = payload,

        /* ---------- System ---------- */

        setSystemData: (state, payload) => state.system = payload,

        setResponseMessage: (state, payload) => {
            state.responseMessage = payload
            setTimeout(() => state.responseMessage = '', 5000)
        },

    },
    actions: {

        /* ---------- Inits ---------- */

        /**
         * Функция загружает все нобходимые состояния для работы в кабинете
         * */
        cabinetInit: (context) => {
            context.dispatch('loadDraft', {author: context.getters.user})
            context.dispatch('loadPublication', {author: context.getters.user})
            context.dispatch('loadThemes')
            context.dispatch('getGroups')
            context.dispatch('getUsers')
        },

        /* ---------- Draft ---------- */

        /**
         * Функция отправляет запрос на получение черновиков,
         * если запрос проходит удачно, публикации добавляются в список
         * @param terms Условие выборки публикаций
         * */
        loadDraft: (context, terms) => {
            const urlRequest = api.MODEL_REQUESTS.work_e(
                api.ESSENCE.publication.name,
                api.ESSENCE.publication.actions.findDraftsByAuthor
            )

            asyncRequest(urlRequest, JSON.stringify(terms))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                        context.commit('addDrafts', response.datas.findings)
                    }
                })
                .catch(err => console.log(err))
        },
        /**
         * Функция отправляет запрос на удаление черновика из БД
         * */
        removeDraft: (context, payload) => {
            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.removeDraft), JSON.stringify(payload))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                        context.commit('removeDraft', response.datas._id)
                    }
                })
                .catch(err => console.log(err))
        },
        /**
         * Функция отправляет запрос на сохранение черновика в БД
         * */
        saveDraft: (context, payload) => {
            asyncRequest(
                api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.saveDraft),
                JSON.stringify(payload.draft)
            )
                .then(response => {
                    if ((response.responseCode == api.CODES_RESPONSE.created.responseCode) || (response.responseCode == api.CODES_RESPONSE.updated.responseCode)) {
                        context.commit('setResponseMessage', 'Черновик сохранен')
                        context.commit('addDraft', response.datas)
                    }
                    return response
                })
                .then(payload.customThen)
                .catch(err => console.log(err))
        },

        /* ---------- Publications ---------- */

        /**
         * Функция отправляет запрос на получение новой порции публикаций,
         * если запрос проходит удачно, публикации добавляются в список
         * @param terms Условие выборки публикаций
         * */
        loadPublication: (context, terms = {}) => {
            const urlRequest = api.MODEL_REQUESTS.work_e(
                api.ESSENCE.publication.name,
                ('user' in terms) ? (api.ESSENCE.publication.actions.findSampleByAuthor) : (api.ESSENCE.publication.actions.findSample)
            )

            asyncRequest(urlRequest, JSON.stringify(terms))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                        context.commit('addPublications', response.datas.findings)
                    }
                })
                .catch(err => console.log(err))
        },
        /**
         * Функция отправляет запрос на удаление публикации из БД
         * */
        removePublication: (context, payload) => {
            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.remove), JSON.stringify(payload))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                        context.commit('removePublication', response.datas._id)
                    }
                })
                .catch(err => console.log(err))
        },
        /**
         * Функция отправдяет запрос на публикацию/обновление публикации
         * */
        publish: (context, payload) => {
            let url
            if (payload.publication._id) {
                url = api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.edit)
            }
            else {
                url = api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.publish)
            }
            asyncRequest(
                url,
                JSON.stringify(payload.publication)
            )
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                        context.commit('addPublication', response.datas)
                        context.commit('setResponseMessage', 'Публикация обновлена')
                    }
                    if (response.responseCode == api.CODES_RESPONSE.created.responseCode) {
                        context.commit('addPublication', response.datas)
                        context.commit('setResponseMessage', 'Публикация опубликована')

                        context.dispatch('removeDraft', payload.draft)
                    }

                })
                .then(payload.customThen)
                .catch(err => console.log(err))
        },

        /* ---------- Themes ---------- */

        /**
         * Функция отправляет запрос на получение тем публикаций,
         * если запрос проходит удачно, публикации добавляются в список
         * */
        loadThemes: (context) => {
            const urlRequest = api.MODEL_REQUESTS.work_e(
                api.ESSENCE.publication.name,
                api.ESSENCE.publication.actions.getThemes
            )

            asyncRequest(urlRequest, JSON.stringify(api.BODY_REQUEST.termsSampling))
                .then((response) => {
                    context.commit('addThemes', response.datas.findings)
                })
                .catch((err) => console.log(err))
        },
        /**
         * Функция отправляет запрос на добавление новой темы для публикаций
         * */
        sendTheme: (context, payload) => {
            const url = (payload.theme._id) ? (api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.editTheme)) : (api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.addTheme))

            asyncRequest(url, JSON.stringify(payload.theme))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.created.responseCode || response.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                        context.dispatch('loadThemes')
                    }
                    else {
                        context.commit('setResponseMessage', response.message)
                    }
                })
                .then(payload.customThen)
                .catch(err => {
                    console.log(err)
                })
        },
        /**
         * Функция отправляет запрос на изменение темы для публикаций
         * */
        editTheme: (context, payload) => {
            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.editTheme), JSON.stringify(payload.theme))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                        context.dispatch('loadThemes')
                    }
                })
                .then(payload.customThen)
                .catch(err => {
                    console.log(err)
                })
        },

        /* ---------- System ---------- */

        /**
         * Функция отправляет запрос на получение системных данных.
         * */
        getSystemData: context => {
            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.system.name, api.ESSENCE.system.actions.get), JSON.stringify({}))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                        context.commit('setSystemData', response.datas.findings[0])
                    }
                })
                .catch(err => console.log(err))
        },

        /**
         * Функция отправляет запрос на установку новых системных данных.
         * */
        updateSystemData: (context, payload) => {
            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.system.name, api.ESSENCE.system.actions.edit), JSON.stringify(payload.data))
                .then(payload.customThen)
                .catch(err => console.error(err))
        },

        /* ---------- Users ---------- */

        /**
         * Функция отправляет запрос на авторизацию пользователя
         * */
        auth: (context, payload) => {
            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.auth), JSON.stringify(payload.user))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                        context.commit('setUser', response.datas.findings)
                    }
                    return response
                })
                .then(payload.customThen)
                .catch(err => console.log(err))
        },

        /**
         * Функция отправляет запрос на изменение пароля пользователя
         * */
        changePass: (context, payload) => {
            asyncRequest(
                api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.changePass),
                JSON.stringify(payload.dataPass))
                .then(response => {
                    let message
                    switch (response.responseCode) {
                        case api.CODES_RESPONSE.notFound.responseCode : {
                            message = 'Не найден такой пользователь'
                            break
                        }
                        case api.CODES_RESPONSE.notAcceptable.responseCode : {
                            message = 'Неверно введён текущий пароль'
                            break
                        }
                        case api.CODES_RESPONSE.notImplemented.responseCode : {
                            message = 'Не удалось изменить ваш пароль'
                            break
                        }
                        case api.CODES_RESPONSE.updated.responseCode : {
                            message = 'Ваш пароль изменен'
                            payload.customThen()
                            break
                        }
                    }
                    context.commit('setResponseMessage', message)

                })
                .catch(err => console.log(err))
        },

        /**
         * Функция отправляет запрос на редактирование профиля пользователя
         * */
        editUser: (context, payload) => {
            asyncRequest(
                api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.edit),
                JSON.stringify(payload.user)
            )
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                        context.commit('setResponseMessage', 'Профиль обновлен')
                    }
                })
                .catch(err => console.error(err))
        },

        /**
         * Функция отправляет запрос на вставку/обовление группы пользователей
         * */
        sendGroup: (context, payload) => {
            let url
            if (payload.group._id) {
                url = api.MODEL_REQUESTS.work_e(api.ESSENCE.group.name, api.ESSENCE.group.actions.edit)
            }
            else {
                url = api.MODEL_REQUESTS.work_e(api.ESSENCE.group.name, api.ESSENCE.group.actions.addNew)
            }
            asyncRequest(url, JSON.stringify(payload.group))
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                        context.commit('setGroup', response.datas.findings)
                        context.commit('setResponseMessage', 'Группа пользователей обновлена')
                    }
                    if (response.responseCode == api.CODES_RESPONSE.created.responseCode) {
                        context.commit('setGroup', response.datas.findings)
                        context.commit('setResponseMessage', 'Группа пользователей создана')
                    }
                    payload.customThen()
                })
                .catch(err => console.log(err))
        },

        /**
         * Функция отправляет запрос на получение списка групп пользователей
         * */
        getGroups: (context) => {
            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.group.name, api.ESSENCE.group.actions.getGroups), JSON.stringify({}))
                .then(response => {
                    context.commit('addGroups', response.datas.findings)
                })
        },

        /**
         * Функция отправляет запрос на получение списка пользователей
         * */
        getUsers: (context) => {
            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.getAllUsers), JSON.stringify({}))
                .then(response => {
                    context.commit('addUsers', response.datas.findings)
                })
        },

        sendUser: (context, payload) => {
            let url
            if (payload.user._id) {
                url = api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.edit)
            }
            else {
                url = api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.addNew)
            }

            asyncRequest(
                url,
                JSON.stringify(payload.user)
            )
                .then(response => {
                    if (response.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                        context.commit('setUser', response.datas)
                        context.commit('setResponseMessage', 'Профиль пользователя обновлён')
                    }
                    if (response.responseCode == api.CODES_RESPONSE.created.responseCode) {
                        context.commit('setUser', response.datas)
                        context.commit('setResponseMessage', 'Профиль пользователя создан')
                    }
                    payload.customThen()
                })
                .catch(err => console.log(err))
        }

    },
});
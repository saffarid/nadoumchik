import Vuex                              from 'vuex'
import {asyncRequest, setUser, storages} from "@/js/web";
import api                               from "../../../../app/api/api_desc.js"

export const store = new Vuex.Store({
    state: {
        drafts: {},
        publications: {},
        themesOfPublication: {},
        user: null,
        responseMessage: ''
    },
    getters: {
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

        drafts: state => terms => {
            if (Object.keys(state.drafts).length == 0) {
                store.dispatch('loadDraft', terms)
            }
            return state.drafts
        },
        draftsById: state => (id) => {
            return state.publications[id]
        },

        responseMessage: state => state.responseMessage,

        user: state => state.user,

        themesOfPublication: state => {
            if(Object.keys(state.themesOfPublication).length == 0){
                store.dispatch('loadThemes')
            }
            return state.themesOfPublication
        }
    },
    mutations: {
        addPublications: (state, payload) => {
            for (const p of payload) {
                state.publications[p._id] = p
            }
        },
        addDrafts: (state, payload) => {
            for (const p of payload) {
                state.drafts[p._id] = p
            }
        },
        addDraft: (state, payload) => state.drafts[payload._id] = payload,

        removePublication: (state, payload) => {
            delete state.publications[payload]
        },
        removeDraft: (state, payload) => {
            delete state.drafts[payload]
        },

        addThemes: (state, payload) => {
            let themesOfPublication = payload
            themesOfPublication.sort((theme1, theme2) => {
                return theme1.value.localeCompare(theme2.value)
            })
            for(const themes of themesOfPublication){
                state.themesOfPublication[themes._id] = themes
            }
        },

        setUser: (state, payload) => {
            state.user = payload
        },

        setResponseMessage: (state, payload) => {
            state.responseMessage = payload
            setTimeout(() => state.responseMessage = '', 5000)
        }
    },
    actions: {

        /**
         * Функция загружает все нобходимые состояния для работы в кабинете
         * */
        cabinetInit: (context) => {
            context.dispatch('loadDraft', {author: context.getters.user})
            context.dispatch('loadPublication', {author: context.getters.user})
            context.dispatch('loadThemes')
        },

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
        },

        /**
         * Функция отправляет запрос на получение черновиков,
         * если запрос проходит удачно, публикации добавляются в список
         * @param terms Условие выборки публикаций
         * */
        loadDraft: async (context, terms) => {
            const urlRequest = api.MODEL_REQUESTS.work_e(
                api.ESSENCE.publication.name,
                api.ESSENCE.publication.actions.findDraftsByAuthor
            )

            const response = await asyncRequest(urlRequest, JSON.stringify(terms))

            if (response.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                context.commit('addDrafts', response.datas.findings)
            }

        },

        /**
         * Функция отправляет запрос на получение новой порции публикаций,
         * если запрос проходит удачно, публикации добавляются в список
         * @param terms Условие выборки публикаций
         * */
        loadPublication: async (context, terms = {}) => {
            const urlRequest = api.MODEL_REQUESTS.work_e(
                api.ESSENCE.publication.name,
                ('user' in terms) ? (api.ESSENCE.publication.actions.findSampleByAuthor) : (api.ESSENCE.publication.actions.findSample)
            )

            const response = await asyncRequest(urlRequest, JSON.stringify(terms))

            if (response.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                context.commit('addPublications', response.datas.findings)
            }

        },

        /**
         * Функция отправляет запрос на получение тем публикаций,
         * если запрос проходит удачно, публикации добавляются в список
         * */
        loadThemes: async (context) => {

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
            const url =  (payload.theme._id) ? (api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.editTheme)) : (api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.addTheme))

            asyncRequest(url, JSON.stringify(payload.theme))
                .then( response => {
                    if (response.responseCode == api.CODES_RESPONSE.created.responseCode || response.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                       context.dispatch('loadThemes')
                    } else {
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
                .then( response => {
                    if (response.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                        context.dispatch('loadThemes')
                    }
                })
                .then(payload.customThen)
                .catch(err => {
                    console.log(err)
                })
        },

        /**
         * Функция отправляет запрос на удаление публикации из БД
         * */
        removePublication: async (context, payload) => {
            const response = await asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.remove), JSON.stringify(payload))

            if (response.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                context.commit('removePublication', response.datas._id)
            }
        },

        /**
         * Функция отправляет запрос на удаление черновика из БД
         * */
        removeDraft: async (context, payload) => {
            const response = await asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.removeDraft), JSON.stringify(payload))

            if (response.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                context.commit('removeDraft', response.datas._id)
            }
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
    },
});
import Vuex           from 'vuex'
import {asyncRequest} from "@/js/web";
import api            from "../../../../app/api/api_desc.js"

export const store = new Vuex.Store({
    state: {
        drafts: [],
        publications: [],
        user: {}
    },
    getters: {
        user: state => {
            return state.user
        },
        publications: (state) => (terms) => {
            if (state.publications.length == 0) {
                store.dispatch('loadPublication', terms)
            }

            return state.publications
        },
        publicationById: state => (id) => {
            return state.publications[id]
        },
        drafts: state => {
            return state.publications
        },
        draftsById: state => (id) => {
            return state.publications[id]
        }
    },
    mutations: {
        addPublications: (state, payload) => {
            console.log(['addPublications', state.publications])
            state.publications.push(...payload)
            console.log(['addPublications', payload])
            console.log(['addPublications', state.publications])
        }
    },
    actions: {
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
                .then(() => {
                })
                .catch((err) => {
                })

        }
    },
});
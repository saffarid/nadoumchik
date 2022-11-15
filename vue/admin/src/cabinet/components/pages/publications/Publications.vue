<template>

    <div class="p" :style="styleVars">
        <BorderPane class="list-of-publications">
            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" @click="newPublication" text="Создать"/>
                </div>
            </template>

            <template v-slot:center>
                <Tabs :options="{ useUrlFragment: false }">
                    <Tab :name="'Публикации'">
                        <P_D_Lists
                                :state="publicationsState"
                                :remove="removePublication"
                                :edit="updatePublication"
                        />
                    </Tab>
                    <Tab :name="'Черновики'">
                        <P_D_Lists
                                :d="'draft'"
                                :state="draftsState"
                                :remove="removeDraft"
                                :edit="updateDraft"
                        />
                    </Tab>
                </Tabs>
            </template>
        </BorderPane>
        <EditPublication
                v-if="Object.keys(publication).length != 0"
                :publication="publication"
                @publish="publish"
                :saveDraft="saveDraft"
                @cancel="closeEdit"
        />
    </div>

</template>

<script>
    import {
        computed,
        onDeactivated,
        reactive,
        ref,
        inject,
        watch
    }                      from 'vue'
    import {asyncRequest}  from "@/js/web";
    import {useStore}      from 'vuex'
    import {
        Button,
        BorderPane,
    }                      from 'saffarid-ui-kit'
    import {
        Tabs,
        Tab
    }                      from 'vue3-tabs-component'
    import EditPublication from "@/cabinet/components/pages/publications/EditPublication";
    import P_D_Lists       from "@/cabinet/components/pages/publications/P_D_Lists";

    export default {
        name: "Publications",
        components: {
            P_D_Lists,
            EditPublication,
            Button,
            BorderPane,
            Tabs,
            Tab
        },
        setup() {
            const user = inject('user')
            const api = inject('$api')
            const workObject = inject('workObject')
            const store = useStore()
            let lastWatchingDraft = null

            const publicationsState = reactive({
                list: computed(() => store.getters.publications({author: user.value})),
                thereIsMore: false,
                isLoading: false,
                isReady: true
            })
            const draftsState = reactive({
                list: computed(() => store.getters.drafts({author: user.value})),
                thereIsMore: false,
                isLoading: false,
                isReady: true
            })

            /**
             * Объект публикации, содержит описание контента и описание внешнего представления в списке.
             * Используется для создания новых публикаций или редактирования уже существующих
             * */
            const publication = reactive({})

            /**
             * Объект черновика публикации.
             * */
            const draft = reactive({})

            let stopWatchDraft

            const styleVars = reactive({
                '--main_width': '100%',
                '--shift': '0%',
                '--opacity_list': '1',
                '--opacity_p': '0',
            })

            onDeactivated(() => {
                closeEdit(0)
            })

            /**
             * Функция запускает этап создания новой публикации
             * */
            const newPublication = () => {
                workObject.objectCopy(api.NEW_OBJECTS.publication, publication)
                workObject.objectCopy(api.NEW_OBJECTS.publication, draft)

                publication.author = user.value
                draft.author = user.value
                publication.dateStamp = new Date()

                startWatchDraft()

                showEditor()
            }

            /**
             * Функция запускает этап редактирования существующей публикации
             * */
            const updatePublication = (editPublication) => {
                workObject.objectCopy(editPublication, publication)
                showEditor()
            }

            /**
             * Функция отправляет запрос на удаление публикации
             * */
            const removePublication = (removedPublication) => store.dispatch('removePublication', {_id: removedPublication._id})

            const startWatchDraft = () => {
                stopWatchDraft = watch(publication, () => {
                    const t = new Date().getSeconds() - lastWatchingDraft.getSeconds()

                    if (Math.abs(t) > 0) {
                        saveDraft()
                        lastWatchingDraft = new Date()
                    }
                })

                lastWatchingDraft = new Date()
            }

            const saveDraft = () => {
                workObject.objectCopy(publication, draft)
                store.dispatch('saveDraft', {
                    draft: draft,
                    customThen: response => {
                        if (response.responseCode == api.CODES_RESPONSE.created.responseCode) draft['_id'] = response.datas._id
                    }
                })
            }

            /**
             * Функция запускает этап редактирования существующего черновика
             * */
            const updateDraft = (editDraft) => {
                workObject.objectCopy(api.NEW_OBJECTS.publication, publication)
                // workObject.objectCopy(user.value, publication.author)
                publication.dateStamp = new Date()

                updatePublication(editDraft)
                delete publication['_id']

                workObject.objectCopy(editDraft, draft)
                // workObject.objectCopy(user.value, draft.author)

                publication.author = user.value
                draft.author = user.value

                startWatchDraft()
            }

            /**
             * Функция отправляет запрос на удаление черновика
             * */
            const removeDraft = (removedDraft) => store.dispatch('removeDraft', {_id: removedDraft._id})

            /**
             * Функция собирает объект публикации и отсылает его на сервер
             * */
            const publish = () => {
                if (publication._id) {
                    asyncRequest(
                        api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.edit),
                        JSON.stringify(publication)
                    )
                        .then(data => {
                            if (data.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                                workObject.objectCopy(publication, lists.publications[data.datas._id])
                            }
                            alert('Публикация обновлена')
                            closeEdit()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                else {
                    asyncRequest(
                        api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.publish),
                        JSON.stringify(publication)
                    )
                        .then(async data => {
                            if (data.responseCode == api.CODES_RESPONSE.created.responseCode) {
                                lists.publications[data.datas._id] = data.datas

                                const removedResponse = await asyncRequest(
                                    api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.removeDraft),
                                    JSON.stringify(draft)
                                )

                                if (removedResponse.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                                    delete lists.drafts[draft._id]
                                }
                            }
                            alert('Публикация опубликована')
                            closeEdit()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }

            /**
             * Функция закрывает блок с редактированием/созданием публикации
             * */
            const closeEdit = (timeout = 2000) => {
                if (stopWatchDraft != undefined) stopWatchDraft()

                styleVars['--main_width'] = '100%'
                styleVars['--shift'] = '0'
                styleVars['--opacity_list'] = '1'
                styleVars['--opacity_p'] = '0'
                setTimeout(() => {
                    for (const key of Object.keys(publication)) {
                        delete publication[key]
                    }
                    for (const key of Object.keys(draft)) {
                        delete draft[key]
                    }
                }, timeout)

            }

            const showEditor = () => {
                styleVars['--main_width'] = '200%'
                styleVars['--shift'] = '-100%'
                styleVars['--opacity_list'] = '0'
                styleVars['--opacity_p'] = '1'
            }

            return {
                closeEdit,
                draftsState,
                publicationsState,

                newPublication,
                saveDraft,
                removeDraft,
                removePublication,
                updatePublication,
                updateDraft,
                publish,
                publication,

                styleVars
            }
        }
    }
</script>

<style lang="scss">

    .p {
        position: relative;
        left: var(--shift);
        width: var(--main_width);
        transition: left 1s;
        display: flex;

        .list-of-publications {
            width: 100%;
            transition: opacity 1s ease-out;
            opacity: var(--opacity_list);
        }

        .new-publication {
            width: 100%;
            opacity: var(--opacity_p);
            transition: opacity 1s ease-in;
        }
    }

</style>

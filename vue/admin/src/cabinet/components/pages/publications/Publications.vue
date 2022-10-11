<template>

    <div class="p" :class="{'show_editor': Object.keys(publication).length != 0}">
        <BorderPane class="list-of-publications">
            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" @click="newPublication" text="Создать"/>
                </div>
            </template>

            <template v-slot:center>
                <Tabs :options="{ useUrlFragment: false }">
                    <Tab :name="'Публикации'">
                        <BorderPane style="row-gap: 2px">
                            <template v-slot:top>
                                <div></div>
                            </template>
                            <template v-slot:center>
                                <List
                                        @edit="updatePublication"
                                        @remove="removePublication"
                                        :type="lists.simple"
                                        :list="publList"
                                        style="height: 77vh; overflow-y: auto; "
                                />

                                <PageLoading v-if="isLoading.publication && !isReady.publication"/>

                                <NotFound
                                        v-if="(Object.keys(publList).length == 0 && !thereIsMore.publication) && !isLoading.publication"/>
                            </template>
                        </BorderPane>
                    </Tab>
                    <Tab :name="'Черновики'">
                        <BorderPane>
                            <template v-slot:center>
                                <div>
                                    <List
                                            v-if="Object.keys(draftList).length != 0"
                                            @edit="updateDraft"
                                            @remove="removeDraft"
                                            :type="lists.simple"
                                            :list="draftList"
                                    />

                                    <PageLoading v-if="isLoading.draft"/>
                                    <NotFound
                                            v-if="(Object.keys(draftList).length == 0 && !thereIsMore.draft) && !isLoading.draft"/>
                                </div>
                            </template>

                        </BorderPane>
                    </Tab>
                </Tabs>
            </template>
        </BorderPane>
        <EditPublication
                :publication="publication"
                @publish="publish"
                :saveDraft="saveDraft"
                @cancel="closePopup"
        />
    </div>

</template>

<script>
    import {
        reactive,
        ref,
        inject,
        watch
    }                      from 'vue'
    import {asyncRequest}  from "@/js/web";
    import {
        Button,
        BorderPane,
        Card,
        TextLabel,
        PageLoading,
    }                      from 'saffarid-ui-kit'
    import {
        Tabs,
        Tab
    }                      from 'vue3-tabs-component'
    import AmountUpload    from "@/components/commons/publications_list/AmountUpload";
    import Plus            from "@/assets/img/plus";
    import EditPublication from "@/cabinet/components/pages/publications/EditPublication";
    import NotFound        from "@/components/commons/NotFound";
    import List            from "@/components/commons/publications_list/lists/List";
    import Row             from "@/components/commons/Row";
    import {list_types}    from '@/components/commons/publications_list/lists/list_types'

    export default {
        name: "Publications",
        components: {
            AmountUpload,
            List,
            Card,
            EditPublication,
            Button,
            PageLoading,
            NotFound,
            Plus,
            BorderPane,
            Row,
            TextLabel,
            Tabs,
            Tab
        },
        setup() {
            const user = inject('user')
            const api = inject('$api')
            const workObject = inject('workObject')

            let lastWatchingDraft = null

            /**
             * Флаг готовности отображать считанные публикации
             * */
            const isReady = reactive({
                publication: false,
                draft: false
            })
            /**
             * Флаг окончания загрузкиновых публикаций
             * */
            const isLoading = reactive({
                publication: false,
                draft: false
            })
            /**
             * Флаг считвания всех публикаций с сервера
             * */
            const thereIsMore = reactive({
                publication: false,
                draft: false
            })
            /**
             * Массив публикацй
             * */
            const publList = reactive({})
            /**
             * Массив черновиков
             * */
            const draftList = reactive({})

            /**
             * Объект публикации, содержит описание контента и описание внешнего представления в списке.
             * Используется для создания новых публикаций или редактирования уже существующих
             * */
            const publication = reactive({})

            /**
             * Объект серновика публикации.
             * */
            const draft = reactive({})

            /**
             * Кол-во загружаемых публикаций
             * */
            const amountLoad = ref(10)

            const message = ref('')

            let stopWatchDraft


            /**
             * Функция запускает этап создания новой публикации
             * */
            const newPublication = () => {
                workObject.objectCopy(api.NEW_OBJECTS.publication, publication)
                workObject.objectCopy(api.NEW_OBJECTS.publication, draft)

                console.log(user.value)

                publication.author = user.value
                publication.dateStamp = new Date()

                startWatchDraft()
            }

            /**
             * Функция запускает этап редактирования существующей публикации
             * */
            const updatePublication = (editPublication) => {
                workObject.objectCopy(editPublication, publication)
            }

            /**
             * Функция отправляет запрос на удаление публикации
             * */
            const removePublication = (removedPublication) => {
                asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.remove), JSON.stringify({_id: removedPublication._id}))
                    .then(data => {
                        if (data.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                            delete publList[data.datas._id]
                        }
                    })
                    .catch(err => {
                        console.log('Объект успешно не удалён')
                        console.log(err)
                    })
            }

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
                asyncRequest(
                    api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.saveDraft),
                    JSON.stringify(draft)
                )
                    .then(data => {
                        switch (data.responseCode) {
                            case api.CODES_RESPONSE.created.responseCode: {
                                message.value = 'Черновик сохранен'
                                draft['_id'] = data.datas._id
                                draftList[draft._id] = data.datas
                                // workObject.objectCopy(data.datas, draftList[data.datas._id])
                                break
                            }
                            case api.CODES_RESPONSE.updated.responseCode: {
                                message.value = 'Черновик сохранен'
                                // draftList[draft._id] = data.datas
                                workObject.objectCopy(data.datas, draftList[data.datas._id])
                                break
                            }
                        }
                        setTimeout(() => message.value = '', 5000)
                    })
                    .catch(err => console.log(err))
            }

            /**
             * Функция запускает этап редактирования существующего черновика
             * */
            const updateDraft = (editDraft) => {
                workObject.objectCopy(api.NEW_OBJECTS.publication, publication)
                publication.author = user
                publication.dateStamp = new Date()

                updatePublication(editDraft)
                delete publication['_id']

                workObject.objectCopy(editDraft, draft)

                startWatchDraft()
            }

            /**
             * Функция отправляет запрос на удаление черновика
             * */
            const removeDraft = (removedDraft) => {
                asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.removeDraft), JSON.stringify(removedDraft))
                    .then(data => {
                        if (data.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                            delete draftList[data.datas._id]
                        }
                    })
                    .catch(err => {
                        console.log('Объект успешно не удалён')
                        console.log(err)
                    })
            }

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
                                workObject.objectCopy(publication, publList[data.datas._id])
                            }
                            closePopup()
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
                                publList[data.datas._id] = data.datas

                                const removedResponse = await asyncRequest(
                                    api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.removeDraft),
                                    JSON.stringify(draft)
                                )

                                if (removedResponse.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                                    delete draftList[draft._id]
                                }
                            }
                            closePopup()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }

            const lists = list_types

            /**
             * Функция закрывает Popup с редактированием/созданием публикации
             * */
            const closePopup = () => {
                stopWatchDraft()
                console.log('closePopup')
                for (const key of Object.keys(publication)) {
                    delete publication[key]
                }
                for (const key of Object.keys(draft)) {
                    delete draft[key]
                }
            }

            /**
             * Функция отправляет запрос на получение новой порции публикаций,
             * если запрос проходит удачно, публикации добавляются в список для отображения
             * */
            const loadPublications = (shift, count, resolve) => {
                if (resolve == undefined) {
                    resolve = data => {
                        setTimeout(() => {
                            if (data.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                                if (shift == 0) {
                                    for (const key of Object.keys(publList)) {
                                        delete publList[key]
                                    }
                                }

                                for (const obj of data.datas.findings) {
                                    publList[obj._id] = obj
                                }

                                thereIsMore.publication = data.datas.thereIsMore
                            }
                            isReady.publication = true
                            isLoading.publication = false
                        }, 300)
                    }
                }

                isLoading.publication = true

                const samplingTerm = {
                    shift: shift,
                    count: count,
                    author: user.value
                }

                const urlRequest = api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.findSampleByAuthor)

                asyncRequest(urlRequest, JSON.stringify(samplingTerm))
                    .then(resolve)
                    .catch(err => console.log(err))
            }

            loadPublications(
                Object.keys(publList).length,
                amountLoad.value)

            const loadDrafts = () => {
                asyncRequest(
                    api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.findDraftsByAuthor),
                    JSON.stringify({author: user.value})
                )
                    .then(findingsDrafts => {
                            if (findingsDrafts.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                                for (const draft of findingsDrafts.datas.findings) {
                                    draftList[draft._id] = draft
                                }
                                thereIsMore.draft = findingsDrafts.datas.thereIsMore
                            }
                            isReady.draft = true
                            isLoading.draft = false
                        }
                    )
            }

            loadDrafts()

            return {
                amountLoad,
                closePopup,
                draftList,
                // draft,
                message,
                isReady,
                isLoading,
                thereIsMore,
                loadPublications,
                loadDrafts,
                newPublication,
                saveDraft,
                removeDraft,
                removePublication,
                updatePublication,
                updateDraft,
                publish,
                publList,
                publication,
                user,
                lists
            }
        }
    }
</script>

<style lang="scss">

    .p {
        position: relative;
        left: 0;
        width: 200%;
        transition: left 2s;
        display: flex;

        .list-of-publications {
            width: 100%;
            transition: opacity 2s ease-out;
            opacity: 1;
        }

        .new-publication {
            width: 100%;
            opacity: 0;
            transition: opacity 2s ease-out;
        }
    }

    .show_editor {
        left: -100%;

        .list-of-publications {
            opacity: 0;
        }

        .new-publication {
            opacity: 1;
        }
    }
</style>

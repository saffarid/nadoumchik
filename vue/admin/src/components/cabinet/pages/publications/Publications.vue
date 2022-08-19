<template>

    <Card title="ПУБЛИКАЦИИ" style="height: 100%">

        <BorderPane class="list-of-publications">
            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" @click="newPublication" text="Создать"/>
                </div>
            </template>
            <template v-slot:center>

                <BorderPane>
                    <template v-slot:top>
                        <div class="tool-bar">
                            <Row style="column-gap: 5px">
                                <TextLabel label="Загружать по"/>
                                <AmountUpload :amount="amountLoad"/>
                            </Row>
                        </div>
                    </template>
                    <template v-slot:center>
                        <div>
                            <List
                                    @edit="updatePublication"
                                    @remove="removePublication"
                                    :type="lists.simple"
                                    :list="publList"
                            />

                            <PageLoading v-if="isLoading"/>
                            <NotFound v-if="(Object.keys(publList).length == 0 && !thereIsMore) && !isLoading"/>
                        </div>
                    </template>
                    <template v-slot:bottom>
                        <Button
                                v-if="!isLoading && thereIsMore"
                                class="text-button"
                                text="Загрузить ещё"
                                @click="loadPublications(Object.keys(publList).length, amountLoad)"/>
                    </template>
                </BorderPane>


            </template>
        </BorderPane>
        <Popup
                class="new-publication-popup"
                v-if="Object.keys(publication).length != 0"
                @close="closePopup">
            <template v-slot:content>
                <EditPublication
                        :publication="publication"
                        @publish="publish"
                />
            </template>
        </Popup>

    </Card>
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
        Popup,
    }                      from 'saffarid-ui-kit'
    import AmountUpload    from "@/components/commons/publications_list/AmountUpload";
    import Plus            from "@/assets/img/plus";
    import EditPublication from "@/components/cabinet/pages/publications/EditPublication";
    import NotFound        from "@/components/commons/NotFound";
    import List            from "@/components/commons/publications_list/lists/List";
    import Row             from "@/components/commons/Row";
    import {_lists}        from '@/components/commons/publications_list/lists/list_types'

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
            Popup,
        },
        setup() {
            const user = inject('user')
            const api = inject('$api')
            const workObject = inject('workObject')

            let lastWatchingDraft = null

            /**
             * Флаг поднимается когда нечего показывать
             * */
            const nothingShow = ref(false)
            /**
             * Флаг готовности отображать считанные публикации
             * */
            const isReady = ref(false)
            /**
             * Флаг окончания загрузкиновых публикаций
             * */
            const isLoading = ref(false)
            /**
             * Флаг считвания всех публикаций с сервера
             * */
            const thereIsMore = ref(false)
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

            let stopWatchDraft

            /**
             * Функция запускает этап создания новой публикации
             * */
            const newPublication = () => {
                workObject.objectCopy(api.NEW_OBJECTS.publication, publication)
                publication.author = user
                publication.dateStamp = new Date()

                stopWatchDraft = watch(publication, () => {
                    const  t = new Date().getMinutes() - lastWatchingDraft.getMinutes()
                    workObject.objectCopy(publication, draft)
                    console.log(t)
                    console.log(publication)
                    console.log(draft)
                    if (Math.abs(t) >= 1) {

                        draft.dateStamp = new Date()
                        asyncRequest(
                            api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.saveDraft),
                            JSON.stringify(draft)
                        )
                            .then(data => {
                                if(data.responseCode == api.CODES_RESPONSE.created.responseCode){
                                    draft['_id'] = data.datas._id
                                    draftList[draft._id] = draft
                                }
                            })
                            .catch(err => console.log(err))
                        lastWatchingDraft = new Date()
                    }

                })

                lastWatchingDraft = new Date()
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

            /**
             * Функция собирает объект публикации и отсылает его на сервер
             * */
            const publish = () => {
                if (publication._id) {
                    asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.edit), JSON.stringify(publication))
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
                    asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.publish), JSON.stringify(publication))
                        .then(data => {
                            if (data.responseCode == api.CODES_RESPONSE.created.responseCode) {
                                publList[data.datas._id] = data.datas
                            }
                            closePopup()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }

            const lists = _lists


            /**
             * Функция закрывает Popup с редактированием/созданием публикации
             * */
            const closePopup = () => {
                stopWatchDraft()
                for (const key of Object.keys(publication)) {
                    delete publication[key]
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
                                nothingShow.value = !data.thereIsMore && Object.values(publList).length == 0
                                thereIsMore.value = data.thereIsMore
                            }
                            isReady.value = true
                            isLoading.value = false
                        }, 300)
                    }
                }

                isLoading.value = true

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
                            }
                        }
                    )
            }

            loadDrafts()


            return {
                amountLoad,
                closePopup,
                draftList,
                draft,
                nothingShow,
                isReady,
                isLoading,
                thereIsMore,
                loadPublications,
                newPublication,
                removePublication,
                updatePublication,
                publish,
                publList,
                publication,
                user,
                lists
            }
        }
    }
</script>

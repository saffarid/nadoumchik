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
                                :list="lists.publications"
                                :remove="removePublication"
                                :edit="updatePublication"
                                :is-loading="isLoading.publication"
                                :there-is-more="thereIsMore.publication"
                        />
                    </Tab>
                    <Tab :name="'Черновики'">
                        <P_D_Lists
                                :list="lists.drafts"
                                :remove="removeDraft"
                                :edit="updateDraft"
                                :is-loading="isLoading.draft"
                                :there-is-more="thereIsMore.draft"
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
    import P_D_Lists       from "@/cabinet/components/pages/publications/P_D_Lists";

    export default {
        name: "Publications",
        components: {
            P_D_Lists,
            AmountUpload,
            List,
            Card,
            EditPublication,
            Button,
            PageLoading,
            NotFound,
            Plus,
            BorderPane,
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
             * Списки публикаций и черновиков
             * */
            const lists = reactive({
                publications: reactive({}),
                drafts: reactive({})
            })

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

            /**
             * Сообщение-ответ от сервера
             * */
            const message = ref('')

            let stopWatchDraft

            const styleVars = reactive({
                '--main_width': '100%',
                '--shift': '0%',
                '--opacity_list': '1',
                '--opacity_p': '0',
            })

            /**
             * Функция запускает этап создания новой публикации
             * */
            const newPublication = () => {
                workObject.objectCopy(api.NEW_OBJECTS.publication, publication)
                workObject.objectCopy(api.NEW_OBJECTS.publication, draft)

                publication.author = user.value
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
            const removePublication = (removedPublication) => {
                asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.remove), JSON.stringify({_id: removedPublication._id}))
                    .then(data => {
                        if (data.responseCode == api.CODES_RESPONSE.removed.responseCode) {
                            delete lists.publications[data.datas._id]
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
                                lists.drafts[draft._id] = data.datas
                                // workObject.objectCopy(data.datas, draftList[data.datas._id])
                                break
                            }
                            case api.CODES_RESPONSE.updated.responseCode: {
                                message.value = 'Черновик сохранен'
                                // draftList[draft._id] = data.datas
                                workObject.objectCopy(data.datas, lists.drafts[data.datas._id])
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
                            delete lists.drafts[data.datas._id]
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
                                workObject.objectCopy(publication, lists.publications[data.datas._id])
                            }
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
            const closeEdit = () => {
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
                }, 2000)

            }

            /**
             * Функция отправляет запрос на получение новой порции публикаций,
             * если запрос проходит удачно, публикации добавляются в список для отображения
             * */
            const loadPublications = (shift, count, resolve) => {
                if (resolve == undefined) {
                    resolve = data => {

                        if (data.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                            if (shift == 0) {
                                for (const key of Object.keys(lists.publications)) {
                                    delete lists.publications[key]
                                }
                            }

                            for (const obj of data.datas.findings) {
                                lists.publications[obj._id] = obj
                            }

                            thereIsMore.publication = data.datas.thereIsMore
                        }
                        isReady.publication = true
                        isLoading.publication = false
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
                Object.keys(lists.publications).length,
                amountLoad.value)

            const loadDrafts = () => {
                asyncRequest(
                    api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.findDraftsByAuthor),
                    JSON.stringify({author: user.value})
                )
                    .then(findingsDrafts => {
                            if (findingsDrafts.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                                for (const draft of findingsDrafts.datas.findings) {
                                    lists.drafts[draft._id] = draft
                                }
                                thereIsMore.draft = findingsDrafts.datas.thereIsMore
                            }
                            isReady.draft = true
                            isLoading.draft = false
                        }
                    )
            }
            loadDrafts()


            const showEditor = () => {
                styleVars['--main_width'] = '200%'
                styleVars['--shift'] = '-100%'
                styleVars['--opacity_list'] = '0'
                styleVars['--opacity_p'] = '1'
            }

            return {
                amountLoad,
                closeEdit,
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
                publication,
                user,
                lists,
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

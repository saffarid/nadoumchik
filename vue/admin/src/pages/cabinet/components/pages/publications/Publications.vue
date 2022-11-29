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
                                :scroll="publicationsScroll"
                        />
                    </Tab>
                    <Tab :name="'Черновики'">
                        <P_D_Lists
                                :d="'draft'"
                                :state="draftsState"
                                :remove="removeDraft"
                                :edit="updateDraft"
                                :scroll="draftsScroll"
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
        watch, onBeforeUnmount, onActivated
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
    import EditPublication from "@/pages/cabinet/components/pages/publications/EditPublication";
    import P_D_Lists       from "@/pages/cabinet/components/pages/publications/P_D_Lists";

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
            const store = useStore()
            const user = store.getters.user
            const api = inject('$api')
            const workObject = inject('workObject')
            let lastWatchingDraft = null

            const publicationsState = reactive({
                list: computed(() => store.getters.publications),
                thereIsMore: false,
                isLoading: false,
                isReady: true
            })
            const draftsState = reactive({
                list: computed(() => store.getters.drafts),
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

            onBeforeUnmount(() => {
                publicationsState.list.value = store.getters.publications
                draftsState.list.value = store.getters.drafts
            })

            onActivated(() => {
                publicationsState.list.value = store.getters.publications
                draftsState.list.value = store.getters.drafts
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

                publication.author = user
                draft.author = user
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
                publication.dateStamp = new Date()

                updatePublication(editDraft)
                delete publication['_id']

                workObject.objectCopy(editDraft, draft)

                publication.author = user
                draft.author = user

                startWatchDraft()
            }

            /**
             * Функция отправляет запрос на удаление черновика
             * */
            const removeDraft = (removedDraft) => store.dispatch('removeDraft', {_id: removedDraft._id})

            /**
             * Функция собирает объект публикации и отсылает его на сервер
             * */
            const publish = () => store.dispatch('publish', {
                draft: draft,
                publication: publication,
                customThen: closeEdit
            })

            /**
             * Функция закрывает блок с редактированием/созданием публикации
             * */
            const closeEdit = (timeout = 1000) => {
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

            const publicationsScroll = ($event) => {
                const scrollHeight = $event.target.scrollHeight;
                const scrollTop = $event.target.scrollTop;
                const clientHeight = $event.target.clientHeight;

                if ((scrollHeight - (scrollTop + clientHeight)) < 300) {
                    if (!store.getters.noMorePublications) {
                        store.dispatch('loadPublication', {author: store.getters.user})
                    }
                }
            }
            const draftsScroll = ($event) => {
                const scrollHeight = $event.target.scrollHeight;
                const scrollTop = $event.target.scrollTop;
                const clientHeight = $event.target.clientHeight;

                if ((scrollHeight - (scrollTop + clientHeight)) < 300) {
                    if (!store.getters.noMoreDrafts) {
                        store.dispatch('loadDraft', {author: store.getters.user})
                    }
                }
            }

            return {
                closeEdit,
                draftsState,
                publicationsState,
                publicationsScroll,
                draftsScroll,
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

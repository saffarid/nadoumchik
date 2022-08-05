<template>
    <Card title="ПУБЛИКАЦИИ" style="height: 100%">

<!--    <div style="height: 100%">-->
        <BorderPane class="list-of-publications">
            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" @click="newPublication" text="Создать"/>
                </div>
            </template>
            <template v-slot:center>
                <PublicationList
                        class="cab"
                        :can-edit-publications="true"
                        :has-row-gap="true"
                        @edit="updatePublication"
                        @remove="removePublication"
                        ref="publicationsList"
                        style="max-height: 76.8vh; overflow-y: auto"
                />
            </template>
        </BorderPane>
        <Popup
                class="new-publication-popup"
                v-if="editPublicationShow"
                @close="editPublicationShow = false">
            <template v-slot:content>
                <EditPublication
                        :publication="publication"
                        @publish="publish"
                />
            </template>
        </Popup>
<!--    </div>-->
    </Card>
</template>

<script>
    import {
        reactive,
        ref,
        inject
    }                      from 'vue'
    import {asyncRequest}  from "@/js/web";
    import {
        Button,
        BorderPane,
        Card,
        TextLabel,
        Popup,
    }                      from 'saffarid-ui-kit'
    import Plus            from "@/assets/img/plus";
    import EditPublication from "@/components/cabinet/pages/publications/EditPublication";
    import PublicationList from "@/components/commons/publications_list/PublicationList";

    export default {
        name: "Publications",
        components: {
            Card,
            PublicationList,
            EditPublication,
            Button,
            Plus,
            BorderPane,
            TextLabel,
            Popup,
        },
        setup() {
            const api = inject('$api')
            const workObject = inject('workObject')
            const publicationsList = ref(null)
            const editPublicationShow = ref(false)
            const isReady = ref(false)
            const articles = ref([])
            const countLoadPublications = ref(10)

            const emptyPublication = api.DATABASE.collections.publications.newObject;
            /**
             * Объект публикации, содержит описание контента и описание внешнего представления в списке.
             * Используется для создания новых публикаций или редактирования уже существующих
             * */
            const publication = reactive({})

            /**
             * Функция запускает этап создания новой публикации
             * */
            const newPublication = () => {
                workObject.objectCopy(emptyPublication, publication)
                publication.dateStamp = new Date()
                editPublicationShow.value = true
            }

            /**
             * Функция запускает этап редактирования существующей публикации
             * */
            const updatePublication = (editPublication) => {
                workObject.objectCopy(editPublication, publication)
                editPublicationShow.value = true
            }

            /**
             * Функция отправляет запрос на удаление публикации
             * */
            const removePublication = (removedPublication) => {
                asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.remove), JSON.stringify({_id: removedPublication._id}))
                    .then(data => {
                        if (data.responseCode === api.CODES_RESPONSE.removed.responseCode) {
                            publicationsList.value.refreshList(-1)
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
                    asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.update), JSON.stringify(publication))
                        .then(data => {
                            editPublicationShow.value = false
                            if (data.responseCode === api.CODES_RESPONSE.updated.responseCode) {
                                publicationsList.value.refreshList(0)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                else {
                    asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.insert), JSON.stringify(publication))
                        .then(data => {
                            editPublicationShow.value = false
                            if (data.responseCode === api.CODES_RESPONSE.created.responseCode) {
                                publicationsList.value.refreshList(1)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }

            return {
                publish,
                articles,
                isReady,
                countLoadPublications,
                editPublicationShow,
                newPublication,
                removePublication,
                updatePublication,
                publication,
                publicationsList
            }
        }
    }
</script>

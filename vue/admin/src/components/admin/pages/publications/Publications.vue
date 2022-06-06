<template>
    <div style="height: 100%">
        <BorderPane class="list-of-publications">
            <template v-slot:top>
                <div class="tool-bar">
                    <TextLabel label="ПУБЛИКАЦИИ"/>

                    <Button class="image-button" @click="newPublication">
                        <plus height="16" width="16"/>
                    </Button>
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
            <template v-slot:bottom>
                <!-- Строка состояния ответа -->
                <ResponseBar :response="response"/>
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
    </div>
</template>

<script>
    import {
        reactive,
        ref,
        toRaw,
        inject
    }                     from 'vue'
    import {asyncRequest} from "@/js/web";

    import {
        Button,
        BorderPane,
        TextLabel,
        Popup,
    }                      from 'saffarid-ui-kit'
    import Plus            from "@/assets/img/plus";
    import EditPublication from "@/components/admin/pages/publications/EditPublication";
    import ResponseBar     from "@/components/admin/pages/publications/ResponseBar";
    import PublicationList from "@/components/commons/publications_list/PublicationList";

    export default {
        name: "Publications",
        components: {
            PublicationList,
            ResponseBar,
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

            const response = reactive({
                code: -1,
                message: 'empty'
            })

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
                        response.code = data.responseCode
                        response.message = data.message

                        publicationsList.value.refreshList(-1)
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
                    console.log(publication)
                    asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.update), JSON.stringify(publication))
                        .then(data => {
                            console.log(data)
                            editPublicationShow.value = false

                            response.code = data.responseCode
                            response.message = data.message

                            publicationsList.value.refreshList(0)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                else {
                    asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.insert), JSON.stringify(publication))
                        .then(data => {
                            console.log(data)
                            editPublicationShow.value = false

                            response.code = data.responseCode
                            response.message = data.message

                            publicationsList.value.refreshList(1)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }

            return {
                response,
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

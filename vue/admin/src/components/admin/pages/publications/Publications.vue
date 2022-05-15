<template>
    <div style="height: 100%">
        <BorderPane class="list-of-publications">
            <template v-slot:top>
                <BorderPane class="tool-bar">
                    <template v-slot:left>
                        <TextLabel label="ПУБЛИКАЦИИ"/>
                    </template>
                    <template v-slot:right>
                        <Button class="image-button" @click="newPublication">
                            <plus height="16" width="16"/>
                        </Button>
                    </template>
                </BorderPane>
            </template>
            <template v-slot:center>
                <PublicationList
                        class="cab"
                        :can-edit-publications="true"
                        :has-row-gap="true"
                        @edit="updatePublication"
                        @remove="removePublication"
                        ref="publicationsList"
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
        toRaw
    } from 'vue'
    import {asyncRequest} from "@/js/web";

    import {
        Button,
        BorderPane,
        TextLabel,
        Popup,
    } from 'saffarid-ui-kit'
    import Plus from "@/assets/img/plus";
    import EditPublication from "@/components/admin/pages/publications/EditPublication";
    import ResponseBar from "@/components/admin/pages/publications/ResponseBar";
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
            const publicationsList = ref(null)
            const editPublicationShow = ref(false)
            const isReady = ref(false)
            const articles = ref([])
            let countLoadPublications = ref(10)

            const response = reactive({
                code: -1,
                message: 'empty'
            })

            /**
             * Объект публикации, содержит описание контента и описание внешнего представления в списке.
             * Используется для создания новых публикаций или редактирования уже существующих
             * */
            const publication = reactive({
                _id: undefined,
                dateStamp: undefined,
                content: {
                    title: 'Your title is here',
                    content: 'Your publication`s content is here'
                },
                preview: {
                    imgOnLeft: true,
                    backgroundColor: '#B7AEAE',
                    textIsDark: true,
                    image: ''
                },
                view: {
                    title: {
                        useImage: false,
                        textColor: '#2b2b2b',
                        image: '#724242',
                        blur: {
                            size: 100,
                            blur: 10,
                            position_y: 50
                        },
                        clear: {
                            size: 50,
                            position_y:50
                        }
                    },
                }
            })

            /**
             * Функция запускает этап создания новой публикации
             * */
            const newPublication = () => {
                publication._id = undefined
                publication.dateStamp = undefined
                publication.content = {
                    title: 'Your title is here',
                    content: 'Your publication`s content is here'
                }
                publication.preview = {
                    imgOnLeft: true,
                    backgroundColor: '#640707',
                    textIsDark: true,
                    image: ''
                }
                publication.view = {
                    title: {
                        useImage: false,
                        textColor: '#2b2b2b',
                        image: '#724242',
                        blur: {
                            size: 100,
                            blur: 10,
                            position_y: 50
                        },
                        clear: {
                            size: 50,
                            position_y:50
                        }
                    },
                }
                editPublicationShow.value = true
            }

            /**
             * Функция запускает этап редактирования существующей публикации
             * */
            const updatePublication = (editPublication) => {
                const publ = toRaw(editPublication)
                publication._id = publ._id
                publication.dateStamp = publ.dateStamp
                publication.content = {
                    title: publ.content.title,
                    content: publ.content.content
                }
                publication.preview = {
                    imgOnLeft: publ.preview.imgOnLeft,
                    backgroundColor: publ.preview.backgroundColor,
                    textIsDark: publ.preview.textIsDark,
                    image: publ.preview.image
                }
                publication.view = {
                    title: {
                        useImage: publ.view.title.useImage,
                        textColor: publ.view.title.textColor,
                        image: publ.view.title.image,
                        blur: {
                            size: publ.view.title.blur.size,
                            blur: publ.view.title.blur.blur,
                            position_y: publ.view.title.blur.position_y
                        },
                        clear: {
                            size: publ.view.title.clear.size,
                            position_y: publ.view.title.clear.position_y
                        }
                    }
                }
                editPublicationShow.value = true
            }

            /**
             * Функция отправляет запрос на удаление публикации
             * */
            const removePublication = (removedPublication) => {
                asyncRequest('/articles/remove', JSON.stringify({_id: removedPublication._id}))
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
                    asyncRequest('/articles/update', JSON.stringify(publication))
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
                } else {
                    asyncRequest('/articles/insert', JSON.stringify(publication))
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

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
                <div class="list" v-if="isReady">
                    <PublicationItem v-for="(publication, index) in articles"
                                     :key="index" :publication="publication"
                                     @edit="updatePublication(publication)"
                                     @remove="removePublication(publication)"
                                     :can-edit="true"
                    />
                    <Button text="Загрузить ещё" @click="loadPublications(articles.length, countLoadPublications)"/>
                </div>
                <div v-else>
                    Загрузка...
                </div>
            </template>
            <template v-slot:bottom>
                <!-- Строка состояния ответа -->
                <ResponseBar :response="response"/>
            </template>
        </BorderPane>
        <Popup v-if="editPublicationShow" @close="editPublicationShow = false">
            <template v-slot:content>
                <EditPublication @publish="publish" :publication="publication"/>
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
    import PublicationItem from "@/components/commons/publications_list/PublicationItem";
    import Plus from "@/assets/img/plus";
    import EditPublication from "@/components/admin/pages/publications/EditPublication";
    import ResponseBar from "@/components/admin/pages/publications/ResponseBar";

    export default {
        name: "Publications",
        components: {
            ResponseBar,
            EditPublication,
            Button,
            Plus,
            PublicationItem,
            BorderPane,
            TextLabel,
            Popup,
        },
        setup() {
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
                    backgroundColor: '#640707',
                    textIsDark: true,
                    image: ''
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

                        loadPublications(
                            0,
                            articles.value.length - 1,
                            data => {
                                setTimeout(() => {
                                    articles.value = data.articles
                                    isReady.value = true
                                }, 300)
                            })
                    })
                    .catch(err => {
                        console.log('Объект успешно не удалён')
                        console.log(err)
                    })
            }

            /**
             * Функция отправляет запрос на получение новой порции публикаций,
             * если запрос проходит удачно, публикации добавляются в список для отображения
             * */
            const loadPublications = (shift, count, resolve) => {
                if (resolve === undefined) {
                    resolve = data => {
                        setTimeout(() => {
                            articles.value = articles.value.concat(data.articles)
                            isReady.value = true
                        }, 300)
                    }
                }
                asyncRequest('/articles/select', JSON.stringify({
                        shift: shift,
                        count: count
                    })
                )
                    .then(resolve)
                    .catch(err => {
                        console.log(err)
                    })
            }
            loadPublications(
                articles.value.length,
                countLoadPublications.value)

            /**
             * Функция собирает объект публикации и отсылает его на сервер
             * */
            const publish = () => {
                if (publication._id) {
                    asyncRequest('/articles/update', JSON.stringify(publication))
                        .then(data => {
                            console.log(data)
                            editPublicationShow.value = false

                            response.code = data.responseCode
                            response.message = data.message

                            loadPublications(
                                0,
                                articles.value.length,
                                data => {
                                    setTimeout(() => {
                                        articles.value = data.articles
                                        isReady.value = true
                                    }, 300)
                                })
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

                            loadPublications(
                                0,
                                articles.value.length + 1,
                                data => {
                                    setTimeout(() => {
                                        articles.value = data.articles
                                        isReady.value = true
                                    }, 300)
                                })
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
                loadPublications,
                countLoadPublications,
                editPublicationShow,
                newPublication,
                removePublication,
                updatePublication,
                publication
            }
        }
    }
</script>

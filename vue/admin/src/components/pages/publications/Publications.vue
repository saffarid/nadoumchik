<template>
    <div>
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
                <div v-if="isReady">
                    <PublicationItem v-for="(publication, index) in articles"
                                     :key="index" :publication="publication"
                                     @edit="updatePublication(publication)"
                                     @remove="removePublication(publication)"
                    />
                    <Button text="Загрузить ещё" @click="loadPublications"/>
                </div>
                <div v-else>
                    Загрузка...
                </div>
            </template>
        </BorderPane>
        <Popup v-if="editPublicationShow" @close="editPublicationShow = false">
            <template v-slot:content>
                <EditPublication :publication="publication"/>
            </template>
        </Popup>
    </div>
</template>

<script>
    import {
        reactive,
        ref,
    } from 'vue'
    import {asyncRequest} from "@/js/web";

    import {
        Button,
        BorderPane,
        TextLabel,
        Popup
    } from 'saffarid-ui-kit'
    import PublicationItem from "@/components/pages/publications/PublicationItem";
    import Plus from "@/assets/img/plus";
    import EditPublication from "@/components/pages/publications/EditPublication";

    export default {
        name: "Publications",
        components: {
            EditPublication,
            Button,
            Plus,
            PublicationItem,
            BorderPane,
            TextLabel,
            Popup
        },
        setup() {
            const editPublicationShow = ref(false)
            const isReady = ref(false)
            const articles = ref([])
            let countLoadPublications = ref(10)

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

            const updatePublication = (editPublication) => {
                publication._id = editPublication._id
                publication.dateStamp = editPublication.dateStamp
                publication.content = {
                    title: editPublication.content.title,
                    content: editPublication.content.content
                }
                publication.preview = {
                    imgOnLeft: editPublication.preview.imgOnLeft,
                    backgroundColor: editPublication.preview.backgroundColor,
                    textIsDark: editPublication.preview.textIsDark,
                    image: editPublication.preview.image
                }
                editPublicationShow.value = true
            }

            const removePublication = (removedPublication) => {
                asyncRequest('/articles/remove', JSON.stringify({_id: removedPublication._id}))
                .then(data => {
                    console.log('Объект успешно удалён')
                    console.log(data)
                })
                .catch(err => {
                    console.log('Объект успешно не удалён')
                    console.log(err)
                })
            }

            const loadPublications = () => {
                asyncRequest('/articles/select', JSON.stringify({
                        shift: articles.value.length,
                        count: countLoadPublications.value
                    })
                )
                    .then(data => {
                        setTimeout(() => {
                            articles.value = articles.value.concat(data.articles)
                            console.log(data)
                            isReady.value = true
                        }, 300)

                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            loadPublications()

            return {
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

<style lang="scss" scoped>

</style>
<template>
    <Tabs :options="{ useUrlFragment: false }">
        <Tab :name="'ОТОБРАЖЕНИЕ В СПИСКЕ'">

        </Tab>
        <Tab :name="'СОДЕРЖИМОЕ'">
            <div>
                <BorderPane class="new-publication">
                    <template v-slot:top>
                        <BorderPane class="tool-bar">
                            <template v-slot:left>
                                <eye
                                        :height="50" :width="50"
                                        @click="popupIsShow = true"
                                />
                            </template>
                            <template v-slot:right>
                                <Button class="text-button" text="ОПУБЛИКОВАТЬ" @click="publish()"/>
                            </template>
                        </BorderPane>
                    </template>
                    <template v-slot:center>
                        <div class="editor">
                            <TextField
                                    class="title"
                                    type="text"
                                    v-model="publication.title"
                            />
                            <editor
                                    ref="edit"
                                    api-key="no-api-key"
                                    :init="{
                                plugins: 'lists link image table code help wordcount preview media save visualblocks emoticons'
                            }"
                                    initial-value="publication.content"
                                    v-model="publication.content"
                            />
                        </div>
                        <div ref="result">
                        </div>
                    </template>
                </BorderPane>
                <Popup v-show="popupIsShow" @close="popupIsShow = false" style="z-index: 2"
                       :title="publication.title">
                    <template v-slot:content>
                        <div ref="articleView">
                        </div>
                    </template>

                </Popup>
            </div>
        </Tab>
    </Tabs>

</template>

<script>
    import {
        ref,
        reactive,
        watch,
        onMounted
    } from 'vue'
    import {Tabs, Tab} from 'vue3-tabs-component'
    import editor from '@tinymce/tinymce-vue'

    import {asyncRequest} from "@/js/web";

    import {
        Button,
        BorderPane,
        TextField,
        Popup
    } from 'saffarid-ui-kit'
    import Eye from "@/assets/img/eye";

    export default {
        name: "NewPublication",
        components: {
            Eye,
            editor,
            Button,
            BorderPane,
            TextField,
            Popup,
            Tab,
            Tabs
        },
        setup(){
            const articleView = ref(null)
            const popupIsShow = ref(false)
            const publication = reactive({
                title: 'Your title is here',
                content: 'Your publication`s content is here'
            })
            const publicationView = reactive({
                imgOnLeft: false,
                clrBackground: 'red',
                textIsDark: true,
                image: ''
            })

            /**
             * Функция собирает объект публикации и отсылает его на сервер
             * */
            const publish = () => {
                asyncRequest('/articles/insert', JSON.stringify(publication))
                    .then(data => {
                        console.log(data)
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }

            const refreshContentView = () => {
                articleView.value.innerHTML = publication.content
            };

            onMounted(refreshContentView)
            watch(publication, refreshContentView)

            return {
                publication,
                articleView,
                publish,
                popupIsShow,
                publicationView
            }
        }
    }
</script>

<style lang="scss" scoped>


</style>
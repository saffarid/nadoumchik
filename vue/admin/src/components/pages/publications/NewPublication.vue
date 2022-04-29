<template>
    <BorderPane class="new-publication">
        <template v-slot:top>
            <Button class="text-button publish" text="ОПУБЛИКОВАТЬ" @click="publish()"/>
        </template>
        <template v-slot:center>
            <Tabs :options="{ useUrlFragment: false }">
                <Tab :name="'ОТОБРАЖЕНИЕ В СПИСКЕ'">
                    <div class="new-publication-item-view">
                        <PublicationItem
                                :publication="publication.content"
                                :backgroundColor="publication.preview.backgroundColor"
                                :textIsDark="publication.preview.textIsDark"
                                :imgOnLeft="publication.preview.imgOnLeft"
                        />
                        <Row>
                            <TextLabel :label="`Положение изображения: ${publication.preview.imgOnLeft?'Да':'Нет'}`"/>
                            <Toggle
                                    id="imgOnLeft"
                                    v-model="publication.preview.imgOnLeft"
                                    :true-value="true"
                                    :false-value="false"
                            />
                        </Row>
                        <Row>
                            <TextLabel :label="`Цвет текста: ${publication.preview.textIsDark?'Темный':'Светлый'}`"/>
                            <Toggle
                                    id="textIsDark"
                                    v-model="publication.preview.textIsDark"
                                    :true-value="true"
                                    :false-value="false"
                            />
                        </Row>
                        <Row>
                            <TextLabel :label="`Цвет фона`"/>
                            <input type="color" v-model="publication.preview.backgroundColor">
                        </Row>

                    </div>
                </Tab>
                <Tab :name="'СОДЕРЖИМОЕ'">
                    <div>
                        <BorderPane class="new-publication-content">
                            <template v-slot:top>
                                <eye
                                        :height="50" :width="50"
                                        @click="popupIsShow = true"/>

                            </template>
                            <template v-slot:center>
                                <div class="editor">
                                    <TextField
                                            class="title"
                                            type="text"
                                            v-model="publication.content.title"
                                    />
                                    <editor
                                            ref="edit"
                                            api-key="no-api-key"
                                            :init="{
                                plugins: 'lists link image table code help wordcount preview media save visualblocks emoticons'
                            }"
                                            initial-value="publication.content"
                                            v-model="publication.content.content"
                                    />
                                </div>
                                <div ref="result">
                                </div>
                            </template>
                        </BorderPane>
                        <Popup v-show="popupIsShow" @close="popupIsShow = false" style="z-index: 2"
                               :title="publication.content.title">
                            <template v-slot:content>
                                <div ref="articleView">
                                </div>
                            </template>
                        </Popup>
                    </div>
                </Tab>
            </Tabs>
        </template>
    </BorderPane>

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
        Toggle,
        TextLabel,
        Popup,
        Row
    } from 'saffarid-ui-kit'
    import Eye from "@/assets/img/eye";
    import PublicationItem from "@/components/pages/publications/PublicationItem";

    export default {
        name: "NewPublication",
        components: {
            PublicationItem,
            Eye,
            editor,
            Button,
            BorderPane,
            TextField,
            TextLabel,
            Toggle,
            Popup,
            Row,
            Tab,
            Tabs
        },
        setup() {
            const articleView = ref(null)
            const popupIsShow = ref(false)
            /**
             * Объект публикации, содержит описание контента и описание внешнего представления в списке.
             * */
            const publication = reactive({
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
                articleView.value.innerHTML = publication.content.content
            };

            onMounted(refreshContentView)
            watch(publication, refreshContentView)

            return {
                publication,
                articleView,
                publish,
                popupIsShow
            }
        }
    }
</script>

<style lang="scss" scoped>


</style>
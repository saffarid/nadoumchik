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
                                :publication="localPublication"
                        />
                        <Row>
                            <TextLabel :label="`Положение изображения: ${localPublication.preview.imgOnLeft?'Да':'Нет'}`"/>
                            <Toggle
                                    id="imgOnLeft"
                                    v-model="localPublication.preview.imgOnLeft"
                                    :true-value="true"
                                    :false-value="false"
                            />
                        </Row>
                        <Row>
                            <TextLabel :label="`Цвет текста: ${localPublication.preview.textIsDark?'Темный':'Светлый'}`"/>
                            <Toggle
                                    id="textIsDark"
                                    v-model="localPublication.preview.textIsDark"
                                    :true-value="true"
                                    :false-value="false"
                            />
                        </Row>
                        <Row>
                            <TextLabel :label="`Цвет фона`"/>
                            <input type="color" v-model="localPublication.preview.backgroundColor">
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
                                            v-model="localPublication.content.title"
                                    />
                                    <editor
                                            ref="edit"
                                            api-key="no-api-key"
                                            :init="{
                                plugins: 'lists link image table code help wordcount preview media save visualblocks emoticons'
                            }"
                                            initial-value="publication.content"
                                            v-model="localPublication.content.content"
                                    />
                                </div>
                                <div ref="result">
                                </div>
                            </template>
                        </BorderPane>
                        <Popup v-show="popupIsShow" @close="popupIsShow = false" style="z-index: 2">
                            <template v-slot:header>
                                <TextLabel :label='localPublication.content.title'/>
                            </template>
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
        watch,
        onMounted,
        reactive,
        toRaw
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
        name: "EditPublication",
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
        props:{
          publication: {
              type: Object,
              required: true
          }
        },
        setup(props) {
            const articleView = ref(null)
            const popupIsShow = ref(false)
            const initialPublication = toRaw(props.publication)
            /**
             * Объект публикации, содержит описание контента и описание внешнего представления в списке.
             * */
            const localPublication = reactive({
                _id: initialPublication._id,
                dateStamp: initialPublication.dateStamp,
                content: {
                    title: initialPublication.content.title,
                    content: initialPublication.content.content
                },
                preview: {
                    imgOnLeft: initialPublication.preview.imgOnLeft,
                    backgroundColor: initialPublication.preview.backgroundColor,
                    textIsDark: initialPublication.preview.textIsDark,
                    image: initialPublication.preview.image
                }
            })

            /**
             * Функция собирает объект публикации и отсылает его на сервер
             * */
            const publish = () => {

                if(localPublication._id){
                    asyncRequest('/articles/update', JSON.stringify(localPublication))
                        .then(data => {
                            console.log(data)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    asyncRequest('/articles/insert', JSON.stringify(localPublication))
                        .then(data => {
                            console.log(data)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }

            }

            const refreshContentView = () => {
                articleView.value.innerHTML = localPublication.content.content
            };

            onMounted(refreshContentView)
            watch(localPublication, refreshContentView)

            return {
                localPublication,
                articleView,
                publish,
                popupIsShow
            }
        }
    }
</script>
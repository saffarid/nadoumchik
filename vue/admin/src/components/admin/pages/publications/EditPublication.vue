<template>
    <BorderPane class="new-publication">
        <template v-slot:top>
            <Button class="text-button publish" :text="localPublication._id?'ОБНОВИТЬ':'ОПУБЛИКОВАТЬ'" @click="$emit('publish')"/>
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
        reactive
    } from 'vue'
    import {Tabs, Tab} from 'vue3-tabs-component'
    import editor from '@tinymce/tinymce-vue'


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
    import PublicationItem from "@/components/commons/publications_list/PublicationItem";

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

            const localPublication = reactive(props.publication)

            const refreshContentView = () => {
                articleView.value.innerHTML = localPublication.content.content
            };

            onMounted(refreshContentView)
            watch(localPublication, refreshContentView)

            return {
                localPublication,
                articleView,
                popupIsShow
            }
        }
    }
</script>
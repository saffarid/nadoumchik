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
                        <Row>
                            <TextLabel :label="`Изображение`"/>
                            <input type="file" @change="loadImage">
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
                        <PublicationView v-if="popupIsShow" :publication="localPublication" @close="popupIsShow = false"/>
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
        // Popup,
        Row
    } from 'saffarid-ui-kit'
    import Eye from "@/assets/img/eye";
    import PublicationItem from "@/components/commons/publications_list/PublicationItem";
    import PublicationView from "@/components/commons/publications_list/PublicationView";

    export default {
        name: "EditPublication",
        components: {
            PublicationView,
            PublicationItem,
            Eye,
            editor,
            Button,
            BorderPane,
            TextField,
            TextLabel,
            Toggle,
            // Popup,
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

            const loadImage = (event) => {
                const file = event.target.files[0];
                console.log(file.size)
                const reader = new FileReader()
                // localPublication.preview.image = URL.createObjectURL(file)
                reader.onload = ev => {
                    localPublication.preview.image = ev.target.result
                }
                reader.readAsDataURL(file)
            }

            return {
                localPublication,
                articleView,
                popupIsShow,
                loadImage
            }
        }
    }
</script>
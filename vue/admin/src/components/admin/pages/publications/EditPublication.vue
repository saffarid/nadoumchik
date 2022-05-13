<template>
    <BorderPane class="new-publication">
        <template v-slot:top>
            <Button
                    class="image-button preview"
                    @click="popupIsShow = true">
                <eye
                        :height="36" :width="36"/>
            </Button>
            <Button
                    class="text-button publish"
                    :text="localPublication._id?'ОБНОВИТЬ':'ОПУБЛИКОВАТЬ'"
                    @click="$emit('publish')"/>
        </template>
        <template v-slot:center>
            <Tabs :options="{ useUrlFragment: false }">
                <Tab :name="'ОТОБРАЖЕНИЕ В СПИСКЕ'">
                    <div class="new-publication-item-view">
                        <PublicationItem
                                :publication="localPublication"
                        />
                        <Row>
                            <TextLabel
                                    :label="`Положение изображения: ${localPublication.preview.imgOnLeft?'Да':'Нет'}`"/>
                            <Toggle
                                    id="imgOnLeft"
                                    v-model="localPublication.preview.imgOnLeft"
                                    :true-value="true"
                                    :false-value="false"
                            />
                        </Row>
                        <Row>
                            <TextLabel
                                    :label="`Цвет текста: ${localPublication.preview.textIsDark?'Темный':'Светлый'}`"/>
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
                            <input type="file" @change="loadImage($event,'preview')">
                        </Row>
                    </div>
                </Tab>
                <Tab :name="'СОДЕРЖИМОЕ'">
                    <div>
                        <BorderPane class="new-publication-content">
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

                    </div>
                </Tab>
                <Tab :name="'ЗАГОЛОВОК'">
                    <Title :publication="localPublication" style="min-height: 150px; max-height: min-content"/>
                    <Row>
                        <TextLabel :label="`Цвет текста`"/>
                        <input type="color" v-model="localPublication.view.title.textColor"/>
                    </Row>
                    <Row>
                        <TextLabel
                                :label="`Использовать фоновое изображение: ${localPublication.view.title.useImage?'Да':'Нет'}`"/>
                        <Toggle
                                id="useImage"
                                v-model="localPublication.view.title.useImage"
                                :true-value="true"
                                :false-value="false"
                        />
                    </Row>
                    <template v-if="localPublication.view.title.useImage">
                        <Row>
                            <TextLabel :label="`Фоновое зображение`"/>
                            <input :disabled="!localPublication.view.title.useImage" type="file"
                                   @change="loadImage($event,'title')">
                        </Row>
                    </template>
                    <template v-else>
                        <Row>
                            <TextLabel :label="`Фоновое зображение`"/>
                            <input :disabled="localPublication.view.title.useImage" type="color"
                                   v-model="localPublication.view.title.image">
                        </Row>
                    </template>
                </Tab>
            </Tabs>
        </template>
    </BorderPane>
    <PublicationView
            v-if="popupIsShow"
            :publication="localPublication"
            @close="popupIsShow = false"
    />
</template>

<script>
    import {
        ref,
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
    import PublicationView from "@/components/commons/publications/PublicationView";
    import Title from "@/components/commons/publications/Title";

    export default {
        name: "EditPublication",
        components: {
            Title,
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
        props: {
            publication: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            const popupIsShow = ref(false)

            const localPublication = reactive(props.publication)

            const loadImage = (event, key) => {
                const file = event.target.files[0];
                console.log(file.size)
                const reader = new FileReader()
                // localPublication.preview.image = URL.createObjectURL(file)

                if (!key.localeCompare('preview')) {
                    reader.onload = ev => {
                        localPublication.preview.image = ev.target.result
                    }
                }
                if (!key.localeCompare('title')) {
                    reader.onload = ev => {
                        localPublication.view.title.image = ev.target.result
                    }
                }
                reader.readAsDataURL(file)
            }

            return {
                localPublication,
                popupIsShow,
                loadImage
            }
        }
    }
</script>
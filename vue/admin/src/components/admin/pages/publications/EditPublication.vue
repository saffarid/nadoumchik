<template>
    <BorderPane class="new-publication">
        <template v-slot:top>
            <Button
                    class="image-button preview"
                    @click="popupIsShow = true">
                <eye
                        :height="20" :width="20"/>
            </Button>
            <Button
                    :disabled="!canSendPublication"
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
                            <TextLabel label="Цвет текста"/>
                            <input type="color" v-model="localPublication.preview.textColor">
                        </Row>
                        <Row>
                            <TextLabel label="Цвет фона"/>
                            <input type="color" v-model="localPublication.preview.backgroundColor">
                        </Row>
                        <Row>
                            <TextLabel label="Изображение"/>
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
                    <Title :publication="localPublication"/>
                    <div class="new-publication-item-view">
                        <Row>
                            <TextLabel :label="`Цвет текста`"/>
                            <input type="color" v-model="localPublication.view.title.text.textColor"/>
                        </Row>
                        <Row>
                            <TextLabel label="Шрифт"/>
                            <ComboBox
                                    :options="font"
                                    :modelValue="localPublication.view.title.text.fontFamily"
                                    @update:modelValue="setFont"
                            />
                        </Row>
                        <Row>
                            <TextLabel label="Насыщеность шрифта"/>
                            <div>
                                <input type="number" min="100" max="900" step="100"
                                       v-model="localPublication.view.title.text.fontWeight">
                                <div style="width: 250px">
                                    <Slider
                                            :range="{min:100, max: 900}"
                                            :step="100"
                                            v-model="localPublication.view.title.text.fontWeight"
                                            :tooltips="false"
                                    />
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <TextLabel label="Наклонный текст"/>
                            <Toggle
                                    id="fontStyle"
                                    v-model="localPublication.view.title.text.fontStyle"
                                    :true-value="'oblique'"
                                    :false-value="'normal'"
                            />
                        </Row>
                        <Row>
                            <TextLabel label="Высота заголовка"/>
                            <div>
                                <input type="number" min="50" max="300" step="1"
                                       v-model="localPublication.view.title.height">
                                <div style="width: 250px">
                                    <Slider
                                            :range="{min:50, max: 300}"
                                            :step="1"
                                            v-model="localPublication.view.title.height"
                                            :tooltips="false"
                                    />
                                </div>
                            </div>
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
                                <TextLabel :label="`Фоновое изображение`"/>
                                <input :disabled="!localPublication.view.title.useImage" type="file"
                                       @change="loadImage($event,'title')">

                            </Row>
                            <!--                            <Row>-->
                            <!--                                <TextLabel :label="`Размер размытого изображения`"/>-->
                            <!--                                <input :disabled="!localPublication.view.title.useImage" type="number"-->
                            <!--                                       v-model="localPublication.view.title.blur.size">-->
                            <!--                            </Row>-->
                            <Row>
                                <TextLabel :label="`Положение размытого изображения`"/>
                                <div>
                                    <input :disabled="!localPublication.view.title.useImage"
                                           type="number" min="0" max="100" step="0.1"
                                           v-model="localPublication.view.title.blur.position_y">
                                    <div style="width: 250px">
                                        <Slider
                                                :range="{min:0, max: 100}"
                                                :step="0.1"
                                                v-model="localPublication.view.title.blur.position_y"
                                                :tooltips="false"
                                        />
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <TextLabel :label="`Размытие изображения`"/>
                                <div>
                                    <input :disabled="!localPublication.view.title.useImage"
                                           type="number" min="0" max="10" step="0.1"
                                           v-model="localPublication.view.title.blur.blur">
                                    <div style="width: 250px">
                                        <Slider
                                                :range="{min:0, max: 10}"
                                                :step="0.1"
                                                v-model="localPublication.view.title.blur.blur"
                                                :tooltips="false"
                                        />
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <TextLabel :label="`Размер изображения`"/>
                                <div>
                                    <input :disabled="!localPublication.view.title.useImage"
                                           type="number" min="0" max="100" step="0.1"
                                           v-model="localPublication.view.title.clear.size">
                                    <div style="width: 250px">
                                        <Slider
                                                :range="{min:0, max: 100}"
                                                :step="0.1"
                                                v-model="localPublication.view.title.clear.size"
                                                :tooltips="false"
                                        />
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <TextLabel :label="`Положение изображения`"/>
                                <div>
                                    <input :disabled="!localPublication.view.title.useImage"
                                           type="number" min="0" max="100" step="0.1"
                                           v-model="localPublication.view.title.clear.position_y">
                                    <div style="width: 250px">
                                        <Slider
                                                :range="{min:0, max: 100}"
                                                :step="0.1"
                                                v-model="localPublication.view.title.clear.position_y"
                                                :tooltips="false"
                                        />
                                    </div>
                                </div>
                            </Row>
                        </template>
                        <template v-else>
                            <Row>
                                <TextLabel :label="`Фоновое зображение`"/>
                                <input :disabled="localPublication.view.title.useImage" type="color"
                                       v-model="localPublication.view.title.image">
                            </Row>
                        </template>
                    </div>
                </Tab>
                <Tab :name="'ПРОЧИЕ АТРИБУТЫ'">

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
        reactive,
        computed
    } from 'vue'
    import {Tabs, Tab} from 'vue3-tabs-component'
    import editor from '@tinymce/tinymce-vue'
    import {fonts} from "@/js/fonts";

    import {
        ComboBox,
        Button,
        BorderPane,
        TextField,
        Toggle,
        TextLabel,
        Slider
    } from 'saffarid-ui-kit'
    import Eye from "@/assets/img/eye";
    import PublicationItem from "@/components/commons/publications_list/PublicationItem";
    import PublicationView from "@/components/commons/publications/PublicationView";
    import Title from "@/components/commons/publications/Title";
    import Row from "@/components/commons/Row";

    export default {
        name: "EditPublication",
        components: {
            ComboBox,
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
            Row,
            Tab,
            Tabs,
            Slider
        },
        props: {
            publication: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            const popupIsShow = ref(false)
            const font = fonts

            const localPublication = reactive(props.publication)

            const setFont = (value) => {
                console.log(value)
                localPublication.view.title.text.fontFamily = value
            }

            const fontIndex = computed(() => {
                return font[localPublication.view.title.text.fontFamily]
            })

            const loadImage = (event, key) => {
                const file = event.target.files[0];
                const reader = new FileReader()

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

            const canSendPublication = computed(() => {
                const hasPreviewImage = localPublication.preview.image.localeCompare('') !== 0
                const hasContentTitle = localPublication.content.title.localeCompare('') !== 0
                const hasContent = localPublication.content.content.localeCompare('') !== 0
                const hasViewImage = localPublication.view.title.image.localeCompare('') !== 0

                return hasPreviewImage && hasContentTitle && hasContent && hasViewImage
            })

            return {
                canSendPublication,
                font,
                fontIndex,
                localPublication,
                popupIsShow,
                setFont,
                loadImage
            }
        }
    }
</script>
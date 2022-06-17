<template>
    <BorderPane class="new-publication" @keyup.enter="publish">
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
                    :text="publication._id?'ОБНОВИТЬ':'ОПУБЛИКОВАТЬ'"
                    @click="publish"/>
        </template>
        <template v-slot:center>
            <Tabs :options="{ useUrlFragment: false }">
                <Tab :name="'ОТОБРАЖЕНИЕ В СПИСКЕ'">
                    <div class="new-publication-item-view">
                        <PublicationItem
                                :publication="publication"
                        />
                        <Row>
                            <TextLabel
                                    :label="`Положение изображения: ${publication.preview.imgOnLeft?'Да':'Нет'}`"/>
                            <Toggle
                                    id="imgOnLeft"
                                    v-model="publication.preview.imgOnLeft"
                                    :true-value="true"
                                    :false-value="false"
                            />
                        </Row>
                        <Row>
                            <TextLabel label="Цвет текста"/>
                            <input type="color" v-model="publication.preview.textColor">
                        </Row>
                        <Row>
                            <TextLabel label="Цвет фона"/>
                            <input type="color" v-model="publication.preview.backgroundColor">
                        </Row>
                        <Row>
                            <TextLabel label="Изображение"/>
                            <input type="file" @change="loadImage($event,imageKeys.preview)">
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

                    </div>
                </Tab>
                <Tab :name="'ЗАГОЛОВОК'">
                    <Title :publication="publication"/>
                    <div class="new-publication-item-view">
                        <Row>
                            <TextLabel :label="`Цвет текста`"/>
                            <input type="color" v-model="publication.view.title.text.textColor"/>
                        </Row>
                        <Row>
                            <TextLabel label="Шрифт"/>
                            <ComboBox
                                    :options="font"
                                    v-model="publication.view.title.text.fontFamily"
                            />
                        </Row>
                        <Row>
                            <TextLabel label="Насыщеность шрифта"/>
                            <div>
                                <input type="number" min="100" max="900" step="100"
                                       v-model="publication.view.title.text.fontWeight">
                                <div style="width: 250px">
                                    <Slider
                                            :range="{min:100, max: 900}"
                                            :step="100"
                                            v-model="publication.view.title.text.fontWeight"
                                            :tooltips="false"
                                    />
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <TextLabel label="Наклонный текст"/>
                            <Toggle
                                    id="fontStyle"
                                    v-model="publication.view.title.text.fontStyle"
                                    :true-value="'oblique'"
                                    :false-value="'normal'"
                            />
                        </Row>
                        <Row>
                            <TextLabel label="Высота заголовка"/>
                            <div>
                                <input type="number" min="50" max="300" step="1"
                                       v-model="publication.view.title.height">
                                <div style="width: 250px">
                                    <Slider
                                            :range="{min:50, max: 300}"
                                            :step="1"
                                            v-model="publication.view.title.height"
                                            :tooltips="false"
                                    />
                                </div>
                            </div>
                        </Row>
                        <Row>
                            <TextLabel
                                    :label="`Использовать фоновое изображение: ${publication.view.title.useImage?'Да':'Нет'}`"/>
                            <Toggle
                                    id="useImage"
                                    v-model="publication.view.title.useImage"
                                    :true-value="true"
                                    :false-value="false"
                            />
                        </Row>
                        <template v-if="publication.view.title.useImage">
                            <Row>
                                <TextLabel :label="`Фоновое изображение`"/>
                                <input :disabled="!publication.view.title.useImage" type="file"
                                       @change="loadImage($event,imageKeys.title)">

                            </Row>
                            <Row>
                                <TextLabel :label="`Положение размытого изображения`"/>
                                <div>
                                    <input :disabled="!publication.view.title.useImage"
                                           type="number" min="0" max="100" step="0.1"
                                           v-model="publication.view.title.blur.position_y">
                                    <div style="width: 250px">
                                        <Slider
                                                :range="{min:0, max: 100}"
                                                :step="0.1"
                                                v-model="publication.view.title.blur.position_y"
                                                :tooltips="false"
                                        />
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <TextLabel :label="`Размытие изображения`"/>
                                <div>
                                    <input :disabled="!publication.view.title.useImage"
                                           type="number" min="0" max="10" step="0.1"
                                           v-model="publication.view.title.blur.blur">
                                    <div style="width: 250px">
                                        <Slider
                                                :range="{min:0, max: 10}"
                                                :step="0.1"
                                                v-model="publication.view.title.blur.blur"
                                                :tooltips="false"
                                        />
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <TextLabel :label="`Размер изображения`"/>
                                <div>
                                    <input :disabled="!publication.view.title.useImage"
                                           type="number" min="0" max="100" step="0.1"
                                           v-model="publication.view.title.clear.size">
                                    <div style="width: 250px">
                                        <Slider
                                                :range="{min:0, max: 100}"
                                                :step="0.1"
                                                v-model="publication.view.title.clear.size"
                                                :tooltips="false"
                                        />
                                    </div>
                                </div>
                            </Row>
                            <Row>
                                <TextLabel :label="`Положение изображения`"/>
                                <div>
                                    <input :disabled="!publication.view.title.useImage"
                                           type="number" min="0" max="100" step="0.1"
                                           v-model="publication.view.title.clear.position_y">
                                    <div style="width: 250px">
                                        <Slider
                                                :range="{min:0, max: 100}"
                                                :step="0.1"
                                                v-model="publication.view.title.clear.position_y"
                                                :tooltips="false"
                                        />
                                    </div>
                                </div>
                            </Row>
                        </template>
                        <template v-else>
                            <Row>
                                <TextLabel :label="`Фоновое зображение`"/>
                                <input :disabled="publication.view.title.useImage" type="color"
                                       v-model="publication.view.title.image">
                            </Row>
                        </template>
                    </div>
                </Tab>
                <Tab :name="'ПРОЧИЕ АТРИБУТЫ'">
                    <Row>
                        <TextLabel label="Тема публикации"/>
                        <ComboBox :options="themesOptions"
                                  :modelValue=publication.theme._id
                                  @update:modelValue="setTheme"
                        />
                    </Row>
                </Tab>
            </Tabs>
        </template>
    </BorderPane>
    <PublicationView
            v-if="popupIsShow"
            :publication="publication"
            @close="popupIsShow = false"
    />
</template>

<script>
    import {
        ref,
        inject,
        computed,
    }                      from 'vue'
    import {Tabs, Tab}     from 'vue3-tabs-component'
    import editor          from '@tinymce/tinymce-vue'
    import {fonts}         from "@/js/fonts";
    import {
        ComboBox,
        Button,
        BorderPane,
        TextField,
        Toggle,
        TextLabel,
        Slider
    }                      from 'saffarid-ui-kit'
    import Eye             from "@/assets/img/eye";
    import PublicationItem from "@/components/commons/publications_list/PublicationItem";
    import PublicationView from "@/components/commons/publications/PublicationView";
    import Title           from "@/components/commons/publications/Title";
    import Row             from "@/components/commons/Row";
    import {asyncRequest}  from "@/js/web";

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
        setup(props, context) {
            const api = inject('$api')
            const popupIsShow = ref(false)
            const font = fonts
            const themesOptions = ref({})
            const themes = ref([])
            const imageKeys = {
                preview: 0,
                title: 1
            }

            asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.select), JSON.stringify(api.BODY_REQUEST.termsSampling))
                .then(gettingData => {
                    const res = {}

                    themes.value = gettingData.datas.findings
                    res['-1'] = 'Выберите тему'
                    for (let i = 0; i < themes.value.length; i++) {
                        res[themes.value[i]._id] = themes.value[i].value
                    }
                    themesOptions.value = res
                })

            const setTheme = (newTheme) => {
                themes.value.forEach(theme => {
                    if (theme._id === newTheme) {
                        props.publication.theme = theme
                    }
                })
            }

            const setFont = (value) => {
                props.publication.view.title.text.fontFamily = value
            }

            const fontIndex = computed(() => {
                return font[props.publication.view.title.text.fontFamily]
            })

            /**
             * Загрузка изображения
             * @param event Объект события, используется для получения загруженных файлов
             * @param key {Number} ключ ячейки для загрузки изображения
             * */
            const loadImage = (event, key) => {
                const file = event.target.files[0];
                const reader = new FileReader()

                if (key === imageKeys.preview) {
                    reader.onload = ev => {
                        props.publication.preview.image = ev.target.result
                    }
                }
                if (key === imageKeys.title) {
                    reader.onload = ev => {
                        props.publication.view.title.image = ev.target.result
                    }
                }
                reader.readAsDataURL(file)
            }

            /**
             * Функция эмитит событие публикации
             * */
            const publish = () => {
                if (canSendPublication.value) {
                    context.emit('publish')
                }
            }

            /**
             * Функция отслеживает заполнение всех необходимых полей
             * */
            const canSendPublication = computed(() => {
                const hasPreviewImage = props.publication.preview.image.localeCompare('') !== 0
                const hasContentTitle = props.publication.content.title.localeCompare('') !== 0
                const hasContent = props.publication.content.content.localeCompare('') !== 0
                const hasViewImage = props.publication.view.title.image.localeCompare('') !== 0
                const hasTheme = props.publication.theme !== null && props.publication.theme !== undefined && props.publication.theme._id !== '-1'

                return hasPreviewImage && hasContentTitle && hasContent && hasViewImage && hasTheme
            })

            return {
                canSendPublication,
                font,
                fontIndex,
                popupIsShow,
                setFont,
                setTheme,
                themesOptions,
                loadImage,
                publish,
                imageKeys
            }
        }
    }
</script>
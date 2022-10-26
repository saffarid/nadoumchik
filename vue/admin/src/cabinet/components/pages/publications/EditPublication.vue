<template>
    <BorderPane class="new-publication" @keyup.enter="publish" :style="styleVars">
        <template v-slot:top>
            <div class="tool-bar" style="padding-left:2px">
                <Button class="image-button" @click="$emit('cancel')">
                    <SvgBack :fill="'#000000'" :width="20" :height="20"/>
                </Button>
                <Button
                        class="text-button preview"
                        @click="popupIsShow = true"
                        text="ПРЕДПРОСМОТР"
                />
                <Button
                        :disabled="!canSendPublication"
                        class="text-button publish"
                        :text="publication._id?'ОБНОВИТЬ':'ОПУБЛИКОВАТЬ'"
                        @click="publish"/>
                <Button
                        v-if="!publication._id"
                        class="text-button publish"
                        :text="'В ЧЕРНОВИКИ'"
                        @click="saveDraft"/>
                <span>{{message}}</span>
            </div>
        </template>
        <template v-slot:center>
            <div class="editor">
                <div class="main_settings">
                    <Row>
                        <span>Тема публикации</span>
                        <ComboBox :options="themesOptions"
                                  :modelValue=publication.theme._id
                                  @update:modelValue="setTheme"
                        />
                    </Row>
                    <Row>
                        <span>Заголовок</span>
                        <TextField
                                type="text"
                                v-model="publication.content.title"
                        />
                    </Row>
                    <PublicationItem
                            :type="p_item_types.listed"
                            :data="{
                                    publication: publication,
                                    onLeft: imgOnLeft
                                }"
                    />
                    <Row>
                        <span>Положение изображения. Не влияет на положение изобржения в списке. Служит только для визуального контроля.</span>
                        <Toggle
                                id="imgOnLeft"
                                v-model="imgOnLeft"
                                :true-value="false"
                                :false-value="true"
                        />
                    </Row>
                    <Row>
                        <span>Цвет текста</span>
                        <input type="color" v-model="publication.preview.textColor">
                    </Row>
                    <Row>
                        <span>Цвет фона</span>
                        <input type="color" v-model="publication.preview.backgroundColor">
                    </Row>

                    <Row>
                        <span>Загрузить изображение из интернета</span>
                        <Toggle id="imgPreviewFromWeb"
                                v-model="imgFromWeb.preview"
                                :true-value="true"
                                :false-value="false"/>
                    </Row>
                    <Row v-if="imgFromWeb.preview">
                        <span>Фоновое изображение</span>
                        <input type="text" v-model="publication.preview.image">
                    </Row>
                    <Row v-else>
                        <span>Изображение</span>
                        <input type="file" @change="loadImage($event,imageKeys.preview)">
                    </Row>

                    <div class="phantom_title"><Title :publication="publication"/></div>
                    <Row>
                        <span>Цвет текста</span>
                        <input type="color" v-model="publication.view.title.text.textColor"/>
                    </Row>
                    <Row>
                        <span>Шрифт</span>
                        <ComboBox :options="font"
                                  v-model="publication.view.title.text.fontFamily"/>
                    </Row>
                    <Row>
                        <span>Насыщеность шрифта</span>
                        <div>
                            <input type="number" min="100" max="900" step="100"
                                   v-model="publication.view.title.text.fontWeight">
                            <div style="width: 250px">
                                <Slider :range="{min:100, max: 900}"
                                        :step="100"
                                        v-model="publication.view.title.text.fontWeight"
                                        :tooltips="false"/>
                            </div>
                        </div>
                    </Row>
                    <Row>
                        <span>Наклонный текст</span>
                        <Toggle id="fontStyle"
                                v-model="publication.view.title.text.fontStyle"
                                :true-value="'oblique'"
                                :false-value="'normal'"/>
                    </Row>

                    <Row>
                        <span>{{`Использовать фоновое изображение: ${publication.view.title.useImage?'Да':'Нет'}`}}</span>
                        <Toggle id="useImage"
                                v-model="publication.view.title.useImage"
                                :true-value="true"
                                :false-value="false"/>
                    </Row>
                    <template v-if="publication.view.title.useImage">

                        <Row>
                            <span>Загрузить изображение из интернета</span>
                            <Toggle id="imgTitleFromWeb"
                                    v-model="imgFromWeb.title"
                                    :true-value="true"
                                    :false-value="false"/>
                        </Row>
                        <Row v-if="imgFromWeb.title">
                            <span>Фоновое изображение</span>
                            <input :disabled="!publication.view.title.useImage" type="text"
                                   v-model="publication.view.title.image.src">
                        </Row>
                        <Row v-else>
                            <span>Фоновое изображение</span>
                            <input :disabled="!publication.view.title.useImage" type="file"
                                   @change="loadImage($event,imageKeys.title)">
                        </Row>

                        <Row>
                            <span>Положение изображения</span>
                            <div>
                                <input :disabled="!publication.view.title.useImage"
                                       type="number" min="0" max="100" step="0.1"
                                       v-model="publication.view.title.image.position_y">
                                <div style="width: 250px">
                                    <Slider :range="{min:0, max: 100}"
                                            :step="0.1"
                                            v-model="publication.view.title.image.position_y"
                                            :tooltips="false"/>
                                </div>
                            </div>
                        </Row>
                    </template>
                    <template v-else>
                        <Row>
                            <span>Цвет фона</span>
                            <input :disabled="publication.view.title.useImage" type="color"
                                   v-model="publication.view.title.image.src">
                        </Row>
                    </template>
                </div>
                <div class="wysiwyg">
                    <editor
                            ref="edit"
                            api-key="no-api-key"
                            :init="{
                                plugins: 'lists link image table code help wordcount preview media save visualblocks emoticons'
                            }"
                            initial-value="publication.content"
                            v-model="publication.content.content"/>
                </div>
            </div>
        </template>
        <template v-slot:bottom>
            <div class="tool-bar">
                <Button class="text-button preview"
                        :disabled="activeSettings == 0b10"
                        @click="showSettings"
                        text="НАСТРОЙКИ"/>
                <Button class="text-button preview"
                        :disabled="activeSettings == 0b01"
                        @click="showEditor"
                        text="РЕДАКТОР"/>
            </div>
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
        reactive
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
    import PublicationItem from "@/components/commons/publications_list/p_item/PublicationItem";
    import PublicationView from "@/components/commons/publications/PublicationView";
    import Title           from "@/components/commons/publications/Title";
    import Row             from "@/components/commons/Row";
    import {asyncRequest}  from "@/js/web";
    import {p_item_types}  from "@/components/commons/publications_list/p_item/p_item_types";
    import SvgBack         from "@/assets/img/SvgBack";

    export default {
        name: "EditPublication",
        components: {
            SvgBack,
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
            },
            message: {
                type: String,
                required: false,
                default: ''
            },
            saveDraft: {
                type: Function,
                required: false,
                default: () => {
                }
            }
        },
        setup(props, context) {
            const api = inject('$api')
            const popupIsShow = ref(false)
            const font = {}
            const themesOptions = ref({})
            const themes = ref([])
            const imageKeys = {
                preview: 0,
                title: 1
            }
            const imgOnLeft = ref(false)

            const activeSettings = ref(0b10)

            const imgFromWeb = reactive({
                preview: false,
                title: false,
            })

            const styleVars = reactive({
                '--shift': '0%',
                '--opacity_settings': '1',
                '--opacity_wysiwyg': '0',
            })

            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.getThemes), JSON.stringify(api.BODY_REQUEST.termsSampling))
                .then(gettingData => {
                    const res = {}

                    themes.value = gettingData.datas.findings
                    res['-1'] = {
                        disabled: true,
                        value: '-1',
                        selected: true,
                        label: 'Выберите тему'
                    }
                    for (let i = 0; i < themes.value.length; i++) {
                        res[themes.value[i]._id] = {
                            disabled: false,
                            value: themes.value[i]._id,
                            selected: false,
                            label: themes.value[i].value
                        }
                    }
                    themesOptions.value = res
                })

            const setTheme = (newTheme) => {
                themes.value.forEach(theme => {
                    if (theme._id == newTheme) {
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
                        props.publication.view.title.image.src = ev.target.result
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
                const hasViewImage = props.publication.view.title.image.src.localeCompare('') !== 0
                const hasTheme = props.publication.theme !== null && props.publication.theme !== undefined && props.publication.theme._id !== '-1'

                return hasPreviewImage && hasContentTitle && hasContent && hasViewImage && hasTheme
            })

            const convertFonts = () => {
                font["-1"] = {
                    disabled: true,
                    value: 'Выберите шрифт',
                    selected: true,
                    label: 'Выберите шрифт'
                }
                for (const k of Object.keys(fonts)) {
                    font[k] = {
                        disabled: false,
                        value: k,
                        selected: false,
                        label: fonts[k]
                    }
                }
            }
            convertFonts()

            const showEditor = () => {
                activeSettings.value = 0b01
                styleVars['--shift'] = '-100%'
                styleVars['--opacity_wysiwyg'] = '1'
                styleVars['--opacity_settings'] = '0'
            }
            const showSettings = () => {
                activeSettings.value = 0b10
                styleVars['--shift'] = '0%'
                styleVars['--opacity_wysiwyg'] = '0'
                styleVars['--opacity_settings'] = '1'
            }

            return {
                activeSettings,
                canSendPublication,
                font,
                fontIndex,
                imgOnLeft,
                imgFromWeb,
                popupIsShow,
                setFont,
                setTheme,
                themesOptions,
                loadImage,
                publish,
                imageKeys,
                p_item_types,
                styleVars,
                showEditor,
                showSettings
            }
        }
    }

</script>

<style lang="scss">

    $height_editor: calc(var(--workspace_h) - 2 * var(--toolbar_h));

    .new-publication {

        height: var(--workspace_h);

        .center_line {
            height: $height_editor !important;
            overflow-y: auto;
        }

        .editor {
            position: relative;
            width: 200%;
            display: flex;
            left: var(--shift);
            transition: left 1s;

            .main_settings {
                position: relative;
                width: 100%;
                display: grid;
                row-gap: 5px;
                opacity: var(--opacity_settings);
                transition: opacity 1s;
                height: $height_editor !important;
                overflow-y: auto;

                .p_item {
                    max-width: 650px;
                }

                .phantom_title {
                    width: 800px;
                    background: var(--primary_color);
                    height: 250px;
                }

                .row {

                    grid-template-columns: 500px 300px;

                    & > div {
                        display: grid;
                        grid-template-columns: 50px auto;
                        align-items: center;
                        justify-items: stretch;

                        column-gap: 5px;
                    }
                }
            }

            .wysiwyg {
                position: relative;
                width: 100%;
                opacity: var(--opacity_wysiwyg);
                transition: opacity 1s;
                height: $height_editor !important;
                overflow-y: auto;

                textarea {
                    width: 800px;
                }

                .tox {
                    width: 800px;
                    height: 100% !important;
                }
            }
        }
    }

</style>
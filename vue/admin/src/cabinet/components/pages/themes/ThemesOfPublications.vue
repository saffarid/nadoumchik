<template>

    <Card title="ТЕМЫ ПУБЛИКАЦИЙ" style="height: 100%">
        <BorderPane class="themes-of-publications">
            <template v-slot:top>
                <div class="tool-bar">
                    <TextField v-model="localTheme.value"/>
                    <Button
                            :disabled="localTheme.value.localeCompare('') == 0"
                            class="image-button" @click="sendTheme">
                        <checkmark :height="20" :width="20"/>
                    </Button>
                    <Button class="image-button" @click="clearLocalTheme">
                        <cancel :height="20" :width="20"/>
                    </Button>
                    <div class="response">
                        {{response.toUpperCase()}}
                    </div>
                </div>
            </template>
            <template v-slot:center>
                <div v-if="isReady">
                    <div class="theme-of-publications" ref="themesList">
                        <ThemeItem
                                v-for="(theme, index) in themes" :key="index"
                                :theme="theme"
                                @edit="updateTheme(theme, index)"
                                @remove="removeTheme(theme)"
                        />
                    </div>
                </div>
                <div v-else>
                    <PageLoading/>
                </div>
            </template>
        </BorderPane>
    </Card>
</template>

<script>
    import {asyncRequest} from "@/js/web";
    import {
        Card,
        BorderPane,
        Button,
        PageLoading,
        TextField,
    }                     from 'saffarid-ui-kit'
    import {
        // onMounted,
        onDeactivated,
        inject,
        ref,
        reactive,
    }                     from 'vue'
    import ThemeItem      from "@/cabinet/components/pages/themes/ThemeItem";
    import Checkmark      from "@/assets/img/checkmark";
    import Cancel         from "@/assets/img/cancel";

    export default {
        name: "ThemesOfPublications",
        components: {
            Card,
            Cancel,
            Checkmark,
            ThemeItem,
            BorderPane,
            Button,
            TextField,
            PageLoading
        },

        setup() {
            const api = inject('$api')
            const isReady = ref(false)
            const themesList = ref(null)
            const themes = reactive([])
            const editedItem = ref(null)
            const localTheme = reactive({
                _id: undefined,
                value: '',
            })

            onDeactivated(() => {
                clearLocalTheme()
            })

            const response = ref('')

            const setResponseMessage = (message) => {
                response.value = message
                if (message != '') {
                    setTimeout(() => {
                        response.value = ''
                    }, 3000)
                }
            }

            const loadThemes = () => {
                asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.getThemes), JSON.stringify(api.BODY_REQUEST.termsSampling))
                    .then(data => {
                        themes.length = 0
                        data.datas.findings.forEach((category) => {
                            themes.push(category)
                        })
                        themes.sort((theme1, theme2) => {
                            return theme1.value.localeCompare(theme2.value)
                        })
                        isReady.value = true
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            loadThemes()

            const clearLocalTheme = () => {
                localTheme._id = undefined
                localTheme.value = ''

                if (editedItem.value !== null) {
                    editedItem.value.classList.toggle('edit')
                    editedItem.value = null
                }
            }

            const sendTheme = () => {
                if (localTheme.value.localeCompare('') === 0) return
                if (localTheme._id) {
                    asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.editTheme), JSON.stringify(localTheme))
                        .then((data) => {
                            if (data.responseCode === api.CODES_RESPONSE.updated.responseCode) {
                                clearLocalTheme()
                                loadThemes()
                            }
                            else {
                                setResponseMessage(data.message)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
                else {
                    asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.addTheme), JSON.stringify(localTheme))
                        .then((data) => {
                            if (data.responseCode === api.CODES_RESPONSE.created.responseCode) {
                                clearLocalTheme()
                                loadThemes()
                            }
                            else {
                                setResponseMessage(data.message)
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                }
            }

            const updateTheme = (theme, index) => {
                clearLocalTheme()
                localTheme._id = theme._id
                localTheme.value = theme.value
                editedItem.value = themesList.value.childNodes[index + 1]
                editedItem.value.classList.toggle('edit')
            }

            const removeTheme = (theme) => {
                asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.removeTheme), JSON.stringify(theme))
                    .then(() => loadThemes())
                    .catch(err => {
                        console.log(err)
                    })
            }

            // onMounted(clearLocalTheme())

            return {
                themes,
                isReady,
                localTheme,
                sendTheme,
                removeTheme,
                updateTheme,
                clearLocalTheme,
                themesList,
                response
            }
        }
    }
</script>

<style lang="scss" scoped>

    .themes-of-publications {
        .tool-bar {
            input {
                min-width: 250px;
                height: 100%;
                border: 0;
                border-bottom: #888888 1px solid;

                &:focus-visible {
                    outline: 0;
                }
            }

            .response {
                display: grid;
                align-content: center;
                justify-content: left;
            }
        }


        .theme-of-publications {
            display: grid;
            row-gap: 2px;
            margin-top: 2px;

            .edit {
                background-color: #888888;
            }
        }

    }

</style>
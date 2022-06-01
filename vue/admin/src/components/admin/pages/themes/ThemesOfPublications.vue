<template>
    <BorderPane class="themes-of-publications">
        <template v-slot:top>
            <div class="edit-category">
                <TextField v-model="localTheme.value"/>
                <Button
                        :disabled="localTheme.value.localeCompare('') === 0"
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
                Загрузка...
            </div>
        </template>
    </BorderPane>
</template>

<script>
    import {asyncRequest} from "@/js/web";
    import {
        BorderPane,
        Button,
        TextField,
    }                     from 'saffarid-ui-kit'
    import {
        // onMounted,
        inject,
        ref,
        reactive,
    }                     from 'vue'
    import ThemeItem      from "@/components/admin/pages/themes/ThemeItem";
    import Checkmark      from "@/assets/img/checkmark";
    import Cancel         from "@/assets/img/cancel";

    export default {
        name: "ThemesOfPublications",
        components: {
            Cancel,
            Checkmark,
            ThemeItem,
            BorderPane,
            Button,
            TextField,
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
                asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.select), JSON.stringify(api.BODY_REQUEST.termsSampling))
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
                    editedItem.value.classList.remove('edit')
                    editedItem.value = null
                }
            }

            const sendTheme = () => {
                if (localTheme.value.localeCompare('') === 0) return
                if (localTheme._id) {
                    asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.update), JSON.stringify(localTheme))
                        .then((data) => {
                            if (data.responseCode === 200) {
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
                    asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.insert), JSON.stringify(localTheme))
                        .then((data) => {
                            if (data.responseCode === 200) {
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
                editedItem.value.classList.add('edit')
            }

            const removeTheme = (theme) => {
                asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.themesOfPublication.name, api.ACTS.remove), JSON.stringify(theme))
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
        .top {
            .edit-category {
                align-content: center;
                align-items: center;
                border-bottom: #888888 1px solid;
                display: grid;
                grid-template-columns: 300px min-content min-content auto;
                padding: 5px;
                /*width: fit-content;*/
                column-gap: 5px;

                input {
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
        }

        .center {
            .theme-of-publications {
                display: grid;
                row-gap: 2px;
                margin-top: 2px;

                .edit {
                    background-color: #888888;
                }
            }
        }

        .left, .right {
            width: 0;
            max-width: 0;
        }
    }

</style>
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
    } from 'saffarid-ui-kit'
    import {
        // onMounted,
        ref,
        reactive,
    } from 'vue'
    import ThemeItem from "@/components/admin/pages/themes/ThemeItem";
    import Checkmark from "@/assets/img/checkmark";
    import Cancel from "@/assets/img/cancel";

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
            const isReady = ref(false)
            const themesList = ref(null)
            const themes = reactive([])
            const editedItem = ref(null)
            const localTheme = reactive({
                _id: undefined,
                value: '',
            })

            const loadThemes = () => {
                asyncRequest('/themesOfPublication/select', JSON.stringify({}))
                    .then(data => {
                        themes.length = 0
                        data.forEach((category) => {
                            themes.push(category)
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

                if(editedItem.value !== null){
                    editedItem.value.classList.remove('edit')
                    editedItem.value = null
                }
            }

            const sendTheme = () => {
                if (localTheme.value.localeCompare('')) return
                if (localTheme._id){
                    asyncRequest('/themesOfPublication/update', JSON.stringify(localTheme))
                        .then(() => {
                            clearLocalTheme()
                            loadThemes()
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    asyncRequest('/themesOfPublication/insert', JSON.stringify(localTheme))
                        .then(() => {
                            clearLocalTheme()
                            loadThemes()
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
                editedItem.value = themesList.value.childNodes[index+1]
                editedItem.value.classList.add('edit')
            }

            const removeTheme = (theme) => {
                asyncRequest('/themesOfPublication/remove', JSON.stringify(theme))
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
                themesList
            }
        }
    }
</script>

<style lang="scss" scoped>

    .edit-category{
        align-content: center;
        align-items: center;
        border-bottom: #888888 1px solid;
        display: grid;
        grid-template-columns: 300px min-content min-content;
        padding: 5px;
        /*width: fit-content;*/
        column-gap: 5px;
        input{
            height:100%;
            border: 0;
            border-bottom: #888888 1px solid;
            &:focus-visible{
                outline: 0;
            }
        }
    }

    .theme-of-publications{
        display: grid;
        row-gap: 2px;
        margin-top: 2px;
        .edit{
            background-color: #888888;
        }
    }

</style>
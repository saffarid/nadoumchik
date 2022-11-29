<template>
    <TitlePane class="themes-of-publications" title="ТЕМЫ ПУБЛИКАЦИЙ">
        <BorderPane>
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
                        {{response}}
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
                        />
                    </div>
                </div>
                <div v-else>
                    <Loading/>
                </div>
            </template>
        </BorderPane>
    </TitlePane>
</template>

<script>
    import {
        TitlePane,
        BorderPane,
        Button,
        Loading,
        TextField,
    }                 from 'saffarid-ui-kit'
    import {
        onBeforeUnmount,
        onActivated,
        onDeactivated,
        computed,
        ref,
        reactive,
    }                 from 'vue'
    import {useStore} from 'vuex'
    import ThemeItem  from "@/pages/cabinet/components/pages/themes/ThemeItem";
    import Checkmark  from "@/assets/img/checkmark";
    import Cancel     from "@/assets/img/cancel";

    export default {
        name: "ThemesOfPublications",
        components: {
            TitlePane,
            Cancel,
            Checkmark,
            ThemeItem,
            BorderPane,
            Button,
            TextField,
            Loading
        },

        setup() {
            const store = useStore()
            const isReady = ref(true)
            const themesList = ref(null)
            const themes = computed(() => store.getters.themesOfPublication)
            const editedItem = ref(null)
            const localTheme = reactive({
                _id: undefined,
                value: '',
            })

            const response = computed(() => store.getters.responseMessage)

            onBeforeUnmount(() => {
                themes.value = store.getters.themesOfPublication
            })

            onActivated(() => {
                themes.value = store.getters.themesOfPublication
            })

            onDeactivated(() => {
                clearLocalTheme()
            })

            const clearLocalTheme = () => {
                localTheme._id = undefined
                localTheme.value = ''
                if (editedItem.value !== null) {
                    editedItem.value.classList.toggle('edit')
                    editedItem.value = null
                }
            }
            const sendTheme = () => {
                if (localTheme.value.localeCompare('') == 0) return
                store.dispatch('sendTheme', {
                    theme: localTheme,
                    customThen: clearLocalTheme
                })
            }

            const updateTheme = (theme, index) => {
                clearLocalTheme()
                localTheme._id = theme._id
                localTheme.value = theme.value
                editedItem.value = themesList.value.childNodes[index + 1]
                editedItem.value.classList.toggle('edit')
            }

            return {
                themes,
                isReady,
                localTheme,
                sendTheme,
                updateTheme,
                clearLocalTheme,
                themesList,
                response
            }
        }
    }
</script>

<style lang="scss">

    .themes-of-publications {
        background-color: transparent;
        height: 100%;

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
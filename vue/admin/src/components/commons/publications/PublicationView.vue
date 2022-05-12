<template>
    <Popup
            class="publication"
            @close="$emit('close')"
    >
        <template v-slot:header>
            <div
                    :class="{'text-is-dark':localPublication.preview.textIsDark, 'text-is-light':!localPublication.preview.textIsDark}"
                    class="title"
                    :style="styleTitle"
            >
                <h1>
                    {{localPublication.content.title.toUpperCase()}}
                </h1>
            </div>
        </template>
        <template v-slot:content>
            <div ref="articleView">
            </div>
        </template>
    </Popup>
</template>

<script>
    import {
        onMounted,
        reactive,
        ref,
        watch
    } from "vue";

    import {
        Popup,
        // TextLabel
    } from 'saffarid-ui-kit'

    export default {
        name: "PublicationView",
        components: {
            Popup,
            // TextLabel
        },
        props: {
            publication: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            const articleView = ref(null)
            const localPublication = reactive(props.publication)
            const styleTitle = ref(null)

            const refreshContentView = () => {
                if (articleView.value !== null) {
                    articleView.value.innerHTML = localPublication.content.content
                }

                if (localPublication.preview.image !== undefined) {
                    if (localPublication.preview.image.localeCompare('') !== 0) {
                        styleTitle.value = `background: url(${localPublication.preview.image}); color: var(--textColor)`
                    }
                    else {
                        styleTitle.value = `background-color: ${localPublication.preview.backgroundColor}; color: var(--textColor)`
                    }
                } else {
                    styleTitle.value = `background-color: ${localPublication.preview.backgroundColor}; color: var(--textColor)`
                }
            };

            onMounted(refreshContentView)
            watch(localPublication, refreshContentView)

            // watch(localPublication, () => {
            // })

            return {
                articleView,
                localPublication,
                styleTitle
            }
        }
    }
</script>

<template>
    <Popup
            class="publication"
            @close="$emit('close')"
    >
        <template v-slot:header>
            <Title :publication="publication"/>
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
    import Title from "@/components/commons/publications/Title";

    export default {
        name: "PublicationView",
        components: {
            Title,
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

            const refreshContentView = () => {
                if (articleView.value !== null) {
                    articleView.value.innerHTML = localPublication.content.content
                }
            };

            onMounted(refreshContentView)
            watch(localPublication, refreshContentView)

            // watch(localPublication, () => {
            // })

            return {
                articleView,
                localPublication,
            }
        }
    }
</script>

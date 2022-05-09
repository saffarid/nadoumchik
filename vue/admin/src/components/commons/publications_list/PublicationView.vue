<template>
    <Popup @close="$emit('close')" style="z-index: 2">
        <template v-slot:header>
            <TextLabel :label='localPublication.content.title'/>
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
        TextLabel
    } from 'saffarid-ui-kit'

    export default {
        name: "PublicationView",
        components: {
            Popup,
            TextLabel
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
                if (articleView.value !== null)
                    articleView.value.innerHTML = localPublication.content.content
            };

            onMounted(refreshContentView)
            watch(localPublication, refreshContentView)

            return {
                articleView,
                localPublication
            }
        }
    }
</script>

<style scoped>

</style>
<template>
    <div @click="$emit('click', publication)"
         :class="{'image-left':publication.preview.imgOnLeft, 'image-right':!publication.preview.imgOnLeft}"
         class="publication-item"
         :style="`background-color:${publication.preview.backgroundColor}`">
        <div class="image">
            <ArticleLogo :height="90" :width="90"/>
        </div>
        <div
                :class="{'text-right':publication.preview.imgOnLeft, 'text-left':!publication.preview.imgOnLeft, 'text-is-dark':publication.preview.textIsDark, 'text-is-light':!publication.preview.textIsDark}"
                class="text">
            <TextLabel :label="publication.content.title"/>
        </div>
        <div class="buttons">
            <Button @click="$emit('remove')">
                <trash :height="20" :width="20"/>
            </Button>
            <Button @click="$emit('edit')">
                <edit :height="20" :width="20"/>
            </Button>
        </div>
    </div>
</template>

<script>
    import {
        Button,
        TextLabel
    } from 'saffarid-ui-kit'
    import ArticleLogo from "@/assets/img/ArticleLogo";
    import trash from "@/assets/img/trash";
    import edit from "@/assets/img/edit";

    export default {
        name: "PublicationItem",
        components: {
            Button,
            trash,
            edit,
            ArticleLogo,
            TextLabel
        },
        emits: [
            'remove'
        ],
        props: {
            publication: {
                type: Object,
                required: true
            },
            edit: {
                type: Function,
                required: true,
            },
            remove: {
                type: Function,
                required: true,
            }
        },
        setup() {
            return {}
        }
    }
</script>

<style lang="scss" scoped>

</style>
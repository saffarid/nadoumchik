<template>
    <div @click="$emit('click', publication)"
         :class="{'image-left':publication.preview.imgOnLeft, 'image-right':!publication.preview.imgOnLeft}"
         class="publication-item"
         :style="`background-color:${publication.preview.backgroundColor}`">
        <div class="image">
            <ArticleLogo v-if="!publication.preview.image" :height="100" :width="100"/>
                <img v-else :src="publication.preview.image" :height="100" :width="100"/>
        </div>
        <div
                :class="{'text-right':publication.preview.imgOnLeft, 'text-left':!publication.preview.imgOnLeft, 'text-is-dark':publication.preview.textIsDark, 'text-is-light':!publication.preview.textIsDark}"
                class="text">
            <TextLabel :label="publication.content.title.toUpperCase()"/>
        </div>
        <div
                :class="{'text-is-dark':publication.preview.textIsDark, 'text-is-light':!publication.preview.textIsDark}"
                class="buttons"
                v-if="canEdit">
            <Button class="image-button" @click="$emit('remove')">
                <trash :height="20" :width="20"/>
            </Button>
            <Button class="image-button" @click="$emit('edit')">
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
            canEdit:{
                type: Boolean,
                required: false,
                default: false
            }
        },
        setup() {
            return {

            }
        }
    }
</script>

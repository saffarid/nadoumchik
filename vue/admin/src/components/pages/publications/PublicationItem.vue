<template>
    <div    @click="$emit('click', publication)"
            :class="{'image-left':imgOnLeft, 'image-right':!imgOnLeft}"
            class="publication-item"
            :style="`background-color:${backgroundColor}`">
        <div class="image">
            <ArticleLogo :height="90" :width="90"/>
        </div>
        <div
                :class="{'text-right':imgOnLeft, 'text-left':!imgOnLeft, 'text-is-dark':textIsDark, 'text-is-light':!textIsDark}"
                class="text">
            <TextLabel :label="publication.title"/>
        </div>
    </div>
</template>

<script>
    import {
        TextLabel
    } from 'saffarid-ui-kit'
    import ArticleLogo from "@/assets/img/ArticleLogo";

    export default {
        name: "PublicationItem",
        components: {
            ArticleLogo,
            TextLabel
        },
        props: {
            publication: {
                type: Object,
                required: true
            },
            imgOnLeft: {
                type:Boolean,
                required: false,
                default: true
            },
            backgroundColor:{
                type: String,
                required: true
            },
            textIsDark:{
                type: Boolean,
                required: true
            }
        },
        setup(){
            return { }
        }
    }
</script>

<style lang="scss" scoped>

</style>
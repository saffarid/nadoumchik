<template>
    <div    @click="$emit('click')"
            :class="{'image-left':imgOnTheLeft, 'image-right':!imgOnTheLeft}"
            class="article-list-item">
        <div class="image">
            <ArticleLogo :height="sizeImage" :width="sizeImage"/>
        </div>
        <div
                :class="{'text-right':imgOnTheLeft, 'text-left':!imgOnTheLeft}"
                class="text">
            <TextLabel label="HELLO"/>
        </div>
    </div>
</template>

<script>
    import {
        TextLabel
    } from 'saffarid-ui-kit'
    import ArticleLogo from "@/assets/img/ArticleLogo";

    export default {
        name: "ArticleItem",
        components: {
            ArticleLogo,
            TextLabel
        },
        data(){
            return{
                sizeImage:160
            }
        },
        props: {
            article: {
                type: Object,
                required: true
            },
            imgOnTheLeft: {
                type:Boolean,
                required: false,
                default: true
            }
        }
    }
</script>

<style lang="scss" scoped>

    .image-left{
        grid-template-areas: "image text";
        grid-template-columns: 160px 540px;
    }

    .image-right{
        grid-template-areas: "text image";
        grid-template-columns: 540px 160px;
    }

    .article-list-item{
        display: grid;
        padding: 0;
        margin: 0;
        align-content: center;
        align-items: center;
        height: 160px;
        border: darkred 2px solid;

        .image{
            grid-area: image;
            width: 160px;
            height: 160px;
        }

        .text{
            grid-area: text;
            padding: 15px;
            justify-content: center;
            justify-items: center;
            justify-self: center;
        }

        /*.text-left{*/
        /*    justify-content: right;*/
        /*    justify-items: right;*/
        /*    justify-self: right;*/
        /*}*/

        /*.text-right{*/
        /*    justify-content: left;*/
        /*    justify-items: left;*/
        /*    justify-self: left;*/
        /*}*/
    }

</style>
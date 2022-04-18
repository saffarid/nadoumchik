<template>
    <BorderPane class="article-list-item" @click="$emit('click')">
        <template v-slot:left>
            <div class="image">
                <ArticleLogo :height="sizeImage" :width="sizeImage"/>
            </div>
        </template>
        <template v-slot:center>
            <div class="pre-article">
                <TextLabel class="title" :label="article.title"/>
                <TextLabel class="sub-title" :label="article.content"/>
            </div>
        </template>
    </BorderPane>
</template>

<script>
    import {
        BorderPane,
        TextLabel
    } from 'saffarid-ui-kit'
    import ArticleLogo from "@/assets/img/ArticleLogo";

    export default {
        name: "ArticleListItem",
        components: {
            ArticleLogo,
            BorderPane,
            TextLabel
        },
        data(){
            return{
                sizeImage:80
            }
        },
        props: {
            article: {
                type: Object,
                required: true
            }
        }
    }
</script>

<style lang="scss" scoped>
    .article-list-item {
        justify-self: center;
        /*padding: 10px;*/
        min-width: 500px;
        border: #535152 1px solid;
        .image{
            align-self: center;
            justify-self: center;
            padding: 5px;
        }

        .pre-article {
            display: grid;
            grid-template-rows: auto auto;
            padding: 5px;
            align-self: stretch;
            align-content: center;
            align-items: center;
            justify-self: stretch;
            justify-items: center;

            .title{

            }

            .sub-title{

            }
        }
    }
</style>
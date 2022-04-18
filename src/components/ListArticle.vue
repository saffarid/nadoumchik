<template>
<!--    <div>-->
        <div class="list">
            <ArticleListItem
                    v-for="(art, index) in articles" :key="index"
                    :article="art"
                    @click="showedArticle = art"
            />
        </div>
        <Popup v-if="showedArticle !== null" @close="showedArticle = null">
            <template v-slot:content>
                <Article :article="showedArticle"/>
            </template>
        </Popup>
<!--    </div>-->
</template>

<script>
    import Article from "@/components/articles/Article";
    import ArticleListItem from "@/components/ArticleListItem";
    import {
        Popup
    } from 'saffarid-ui-kit'

    export default {
        name: "ListArticle",
        data() {
            return {
                showedArticle: null
            }
        },
        components: {
            Article,
            ArticleListItem,
            Popup
        },
        setup() {

            const articles = [
                {
                    title: "Article#1",
                    content: "Content#1"
                },
                {
                    title: "Article#2",
                    content: "Content#2"
                },
                {
                    title: "Article#3",
                    content: "Content#3"
                },
                {
                    title: "Article#4",
                    content: "Content#4"
                },
                {
                    title: "Article#5",
                    content: "Content#5"
                }
            ]
            return {
                articles,
                // showedArticle
            }
        }
    }
</script>

<style lang="scss" scoped>

    .list{
        display: grid;
        justify-self: center;
        padding: 10px;
        padding-top: 20px;
    }

</style>
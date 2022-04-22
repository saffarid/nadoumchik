<template>
<!--    <div>-->
        <div class="list">
            <ArticleItem
                    v-for="(art, index) in articles" :key="index"
                    :class="{'item-on-left': index % 2 ,  'item-on-right': !(index % 2)}"
                    :article="art"
                    @click="showedArticle = art"
                    :imgOnTheLeft="index%2"
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
    import ArticleItem from "@/components/ArticleItem";
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
            ArticleItem,
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
                },
                {
                    title: "Article#5",
                    content: "Content#5"
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
        /*justify-items: center;*/

        margin: 5px;
        padding: 10px;
        grid-template-columns: minmax(400px, 700px);

        overflow-y: auto;

        .item-on-left{
            justify-content: start;
        }
        .item-on-right{
            justify-content: end;
        }
    }

</style>
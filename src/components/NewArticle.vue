<template>
    <BorderPane>
        <template v-slot:top>
            <TextLabel label="Add new article"/>
        </template>
        <template v-slot:center>
            <div class="form">
                <div>
                    <TextLabel label="name_article"/>
                </div>
                <div>
                    <TextField :modelValue="article.title"/>
                </div>
                <div>
                    <TextLabel label="content_article"/>
                </div>
                <div>
                    <TextField :modelValue="article.content"/>
                </div>
                <Button text="Отправить" @click="sendArticle"/>
            </div>
        </template>
    </BorderPane>
</template>

<script>

    import {
        BorderPane,
        TextField,
        TextLabel
    } from 'saffarid-ui-kit'

    export default {
        name: "NewArticle",
        components:{
            BorderPane,
            TextField,
            TextLabel
        },
        setup(){
            const article = {
                title: "Новая статья",
                content: ""
            }

            const sendArticle = ()=> {

            }
            return {
                article,
                sendArticle
            }
        }
    }
</script>

<style lang="scss" scoped>

    .form{
        display: grid;
        grid-template-rows: repeat(auto-fill, 50px);
    }

</style>
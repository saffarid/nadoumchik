<template>
    <BorderPane class="main-content">
        <template v-slot:center>
            <div class="content">
                <ListArticle/>
            </div>
        </template>
        <template v-slot:right>
            <div class="ads">
                ads
            </div>
        </template>
        <template v-slot:left>
            <div class="ads">
                ads
            </div>
        </template>
    </BorderPane>
</template>

<script>
    import {
        BorderPane
    } from 'saffarid-ui-kit'
    import ListArticle from "./ListArticle";

    export default {
        name: "MainContent",
        components: {
            ListArticle,
            BorderPane
        },
    }
</script>

<style lang="scss" scoped>

    .main-content {
        justify-self: center;
        justify-content: center;

        .ads{
            padding: 10px;
        }

        .content {
            display: grid;
            justify-content: center;
            justify-self: center;
            max-width: 100%;
            overflow-y: auto;
        }
    }



</style>
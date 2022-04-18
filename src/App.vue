<template>
    <BorderPane class="site">
        <template v-slot:top>
            <Header/>
        </template>
        <template v-slot:center>
            <ListArticle/>
        </template>
    </BorderPane>
</template>

<script>

    import { BorderPane } from 'saffarid-ui-kit'
    import Header from "@/components/Header";
    import ListArticle from "@/components/ListArticle";

    export default {
        name: 'App',
        components: {
            ListArticle,
            Header,
            BorderPane
        }
    }
</script>

<style lang="scss">
    @import "./assets/style/main.scss";
</style>

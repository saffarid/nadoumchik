<template>
    <BorderPane
            class="dimesion light site">
        <template v-slot:top>
            <Header/>
        </template>
        <template v-slot:center>
            <MainContent/>
        </template>
    </BorderPane>
</template>

<script>

    import Header from "@/components/Header";
    import MainContent from "./components/MainContent";
    import {
        BorderPane
    } from 'saffarid-ui-kit'


    export default {
        name: 'App',
        components: {
            BorderPane,
            Header,
            MainContent
        }
    }
</script>

<style lang="scss">
    @import "./assets/style/main.scss";
</style>

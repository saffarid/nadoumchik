<template>
    <BorderPane class="header">
        <template v-slot:left>
            <div class="left">
                <TextLabel label="Ссылки на соцсети"/>
            </div>
        </template>
        <template v-slot:center>
            <div class="logo">
                <Logo :height="100" :width="100"/>
            </div>
        </template>
        <template v-slot:right>
            <div class="right">
                <Button class="link" text="Связаться с нами"/>
            </div>
        </template>
        <template v-slot:bottom>
            <div class="menu">
                <div>
                    <TextLabel label="Лучшее"/>
                </div>
                <div>
                    <TextLabel label="Категории"/>
                </div>
                <div>
                    <TextLabel label="Статьи"/>
                </div>
                <div>
                    <TextLabel label="О нас"/>
                </div>
            </div>
        </template>
    </BorderPane>
</template>

<script>
    import Logo from "@/assets/img/logo";
    import {
        BorderPane,
        Button,
        TextLabel
    } from 'saffarid-ui-kit'

    export default {
        name: "Header",
        components: {
            BorderPane,
            Button,
            TextLabel,
            Logo
        }
    }
</script>

<style lang="scss" scoped>
    @import "./src/assets/style/header.scss";

    .link{
        height: 50px;
        border-radius: 25px;
        font-size: 15px;
    }

</style>
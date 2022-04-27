<template>
    <BorderPane class="header">
        <template v-slot:left>
            <Logo :height="100" :width="100"/>
        </template>
        <template v-slot:center>
            <div class="title">
                <TextLabel label="#НАДОУМЧИК"/>
            </div>
        </template>
        <template v-slot:right>
            <Button class="image-button link">
                <mail :width="20" :height="20"/>
            </Button>
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
    import Mail from "../assets/img/mail";

    export default {
        name: "Header",
        components: {
            Mail,
            BorderPane,
            Button,
            TextLabel,
            Logo
        }
    }
</script>

<style lang="scss" scoped>

</style>
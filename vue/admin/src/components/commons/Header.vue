<template>
    <BorderPane class="header">
        <template v-slot:left>
            <div class="left">
                <Logo/>
            </div>
        </template>
        <template v-slot:center>
            <div class="title">
                <TextLabel label="#НАДОУМЧИК"/>
            </div>
        </template>
        <template v-slot:right>
            <div class="right">
                <Button class="image-button link">
                    <mail :width="20" :height="20"/>
                </Button>
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
    }           from 'saffarid-ui-kit'
    import Mail from "../../assets/img/mail";

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
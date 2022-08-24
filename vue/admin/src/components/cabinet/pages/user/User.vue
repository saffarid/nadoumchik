<template>
    <BorderPane>

        <template v-slot:top>
            <div class="tool-bar" style="padding-left:2px">
                <Button class="text-button" :text="'СОХРАНИТЬ'" />
            </div>
        </template>

        <template v-slot:center>

            <Card title="Пароль">
                <p>
                    Пока что не реализовано
                </p>
            </Card>

        </template>

    </BorderPane>
</template>

<script>
    import {
        BorderPane,
        Button,
        Card
    } from 'saffarid-ui-kit'

    export default {
        name: "User",
        components:{
            BorderPane,
            Button,
            Card
        }
    }
</script>

<style scoped>

</style>
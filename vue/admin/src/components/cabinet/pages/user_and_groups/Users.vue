<template>
    <div>
        <BorderPane>

            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" text="Создать"/>
                    <Button class="text-button" text="Редактировать"/>
                    <Button class="text-button" text="Удалить"/>
                </div>
            </template>

            <template v-slot:center>
                <ListUsers :users="users"/>
            </template>

        </BorderPane>
        <Popup>
            <template v-slot:content>
                <UserDescription />
            </template>
        </Popup>
    </div>
</template>

<script>
    import {
        inject
    } from 'vue'

    import {
        BorderPane,
        Button,
    } from 'saffarid-ui-kit'

    import ListUsers       from "./ListUsers";
    import UserDescription from "@/components/cabinet/pages/user_and_groups/UserDescription";

    export default {
        name: "Users",
        components: {
            UserDescription,
            BorderPane,
            Button,
            ListUsers
        },
        setup() {
            const users = inject('users')

            return {
                users
            }
        }
    }
</script>

<style scoped>

</style>
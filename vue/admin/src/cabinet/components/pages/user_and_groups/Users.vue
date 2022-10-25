<template>
    <div>
        <BorderPane>
            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" text="Создать" @click="create"/>
                    <Button class="text-button" text="Удалить"/>
                </div>
            </template>

            <template v-slot:center>
                <ListUsers :users="users" :click-user="clickUser"/>
            </template>
        </BorderPane>

        <UserDescription
                @dismiss="closeUserDescription"
                v-if="showUserDescription"
                :user="showingUser"
                :send="send"/>
    </div>
</template>

<script>
    import {
        inject,
        ref,
        reactive
    }                      from 'vue'
    import {
        BorderPane,
        Button,
        TableView
    }                      from 'saffarid-ui-kit'
    import UserDescription from "@/cabinet/components/pages/user_and_groups/UserDescription";
    import {asyncRequest}  from "@/js/web";
    import ListUsers       from "@/cabinet/components/pages/user_and_groups/ListUsers";

    export default {
        name: "Users",
        components: {
            ListUsers,
            UserDescription,
            BorderPane,
            Button,
            TableView
        },
        setup() {
            const api = inject('$api')
            const users = inject('users')
            const workObject = inject('workObject')
            const showingUser = reactive({})
            const showUserDescription = ref(false)

            const clickUser = (user) => {
                workObject.objectCopy(user, showingUser)
                showUserDescription.value = true
            }

            const closeUserDescription = () => {
                showUserDescription.value = false
                for (const key of Object.keys(showingUser)) {
                    delete showingUser[key]
                }
            }

            const send = () => {
                if (showingUser._id) {
                    //Редактируем
                    asyncRequest(
                        api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.edit),
                        JSON.stringify(showingUser)
                    )
                        .then(data => {
                            if (data.responseCode == api.CODES_RESPONSE.updated.responseCode) {
                                for (const user of users.value) {
                                    if (user._id == data.datas._id) {
                                        workObject.objectCopy(showingUser, user)
                                        break
                                    }
                                }
                                hasShowingUser.value = false
                            }
                        })
                        .catch(err => console.log(err))
                }
                else {
                    //Добавляем
                    asyncRequest(
                        api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.addNew),
                        JSON.stringify(showingUser)
                    )
                        .then(data => {
                            if (data.responseCode == api.CODES_RESPONSE.created.responseCode) {
                                users.value.push(data.datas)
                                hasShowingUser.value = false
                            }
                        })
                        .catch(err => console.log(err))
                }
            }

            const create = () => {
                workObject.objectCopy(api.NEW_OBJECTS.user, showingUser)
                showUserDescription.value = true
            }

            return {
                showingUser,
                showUserDescription,
                closeUserDescription,
                clickUser,
                create,
                send,
                users
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
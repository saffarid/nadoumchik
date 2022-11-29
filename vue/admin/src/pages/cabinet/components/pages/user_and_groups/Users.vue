<template>
    <div>
        <BorderPane>
            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" text="Создать" @click="create"/>
                    <!--                    <Button class="text-button" text="Удалить"/>-->
                </div>
            </template>

            <template v-slot:center>
                <List v-if="usersList.length != 0"
                      :headers="[
                                    {name: 'Пользователь'},
                                    {name: 'Группа'},
                                ]" :items="usersList"
                      :click-item="clickUser"/>
                <span v-else>Нет пользователей</span>
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
        computed,
        inject,
        ref,
        reactive,
        onBeforeUnmount,
        onActivated,
        onDeactivated
    }                      from 'vue'
    import {
        BorderPane,
        Button,
    }                      from 'saffarid-ui-kit'
    import UserDescription from "@/pages/cabinet/components/pages/user_and_groups/UserDescription";
    import {useStore}      from 'vuex';
    import List            from "@/pages/cabinet/components/pages/user_and_groups/List";

    export default {
        name: "Users",
        components: {
            List,
            UserDescription,
            BorderPane,
            Button,
        },
        setup() {
            const store = useStore()
            const api = inject('$api')
            const workObject = inject('workObject')
            const users = computed(() => store.getters.users)

            const showingUser = reactive({})
            const showUserDescription = ref(false)

            onBeforeUnmount(() => {
                users.value = store.getters.users
            })

            onActivated(() => {
                users.value = store.getters.users
            })

            onDeactivated(() => {

            })

            const usersList = computed(() => {
                const res = []
                for (const user of Object.values(users.value)) {
                    res.push({
                        _id: user._id,
                        name: `${user.personal.f_name} ${user.personal.s_name}`,
                        desc: user.group.name
                    })
                }
                return res
            })

            const clickUser = ($event) => {
                workObject.objectCopy(users.value[$event._id], showingUser)
                showUserDescription.value = true
            }
            const closeUserDescription = () => {
                showUserDescription.value = false
                for (const key of Object.keys(showingUser)) {
                    delete showingUser[key]
                }
            }
            const send = () => store.dispatch('sendUser', {
                user: showingUser,
                customThen: closeUserDescription
            })
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
                users,
                usersList
            }
        }
    }
</script>
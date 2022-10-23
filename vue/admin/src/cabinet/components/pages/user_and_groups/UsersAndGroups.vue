<template>
<!--    <div class="user_groups">-->
        <Tabs class="viewer_user_groups" :options="{ useUrlFragment: false }">
            <Tab name="Пользователи">
                <Users/>
            </Tab>
            <Tab name="Группы">
                <Groups/>
            </Tab>
        </Tabs>
<!--    </div>-->
</template>

<script>

    import {Tab, Tabs} from 'vue3-tabs-component'

    import {
        provide,
        // reactive,
        ref,
        inject
    }                     from 'vue'
    import {asyncRequest} from "@/js/web";
    import Groups         from "./Groups";
    import Users          from "./Users";

    export default {
        name: "UsersAndGroups",
        components: {
            Users,
            Groups,
            Tab,
            Tabs,
        },
        setup() {
            const api = inject('$api')
            const workObject = inject('workObject')

            const users = ref([])
            const groups = ref([])

            provide('users', users)
            provide('groups', groups)

            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.getAllUsers), JSON.stringify({}))
                .then(data => {
                    users.value = data.datas.findings
                })

            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.group.name, api.ESSENCE.group.actions.getGroups), JSON.stringify({}))
                .then(data => {
                    groups.value = data.datas.findings
                })

            return {
                groups,
                users
            }
        }
    }
</script>

<style scoped>

</style>
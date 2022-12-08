<template>
    <Tabs class="viewer-user-groups" :options="{ useUrlFragment: false }">
        <Tab name="Пользователи">
            <Users/>
        </Tab>
        <Tab name="Группы">
            <Groups/>
        </Tab>
    </Tabs>
</template>

<script>
    import {Tab, Tabs} from 'vue3-tabs-component'
    import Groups      from "./Groups";
    import Users       from "./Users";

    export default {
        name: "UsersAndGroups",
        components: {
            Users,
            Groups,
            Tab,
            Tabs,
        },
    }
</script>


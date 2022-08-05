<template>

    <TableView :headers="[
                {name: 'Пользователь'},
                {name: 'Группа'},
            ]"
               :items="users">
        <template #row="{item}">
            <tr @click="clickUser(item)">
                <td>{{item.name}}</td>
                <td>{{item.group.name}}</td>
            </tr>
        </template>
    </TableView>

</template>

<script>
    import {
        TableView
    } from 'saffarid-ui-kit'

    export default {
        name: "ListUsers",
        components: {
            TableView
        },
        props: {
            users: {
                type: Object,
                required: true
            }
        },
        setup(props, context){
            const clickUser = (group) => {
                context.emit('clickGroup', group)
            }

            return {
                clickUser,
            }
        }
    }
</script>

<style lang="scss" scoped>

    .toolbar {
        display: inline-grid;
    }

</style>
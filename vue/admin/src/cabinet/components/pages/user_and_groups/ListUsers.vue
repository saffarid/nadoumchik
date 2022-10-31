<template>

    <TableView :headers="[
                {name: 'Пользователь'},
                {name: 'Группа'},
            ]"
               :items="users">
        <template #row="{item}">
            <tr @click="clickUser(item)">
                <td>{{`${item.personal.f_name} ${item.personal.s_name}`}}</td>
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
            },
            clickUser: {
                type: Function,
                required: true
            }
        },
        setup() {
            return {}
        }
    }
</script>

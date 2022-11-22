<template>
    <TableView :headers="headers"
               :items="items">
        <template #row="{item}">
            <tr @click="clickItem(item)">
                <td>{{item.name}}</td>
                <td>{{item.desc}}</td>
            </tr>
        </template>
    </TableView>
</template>

<script>
    import {
        TableView
    } from 'saffarid-ui-kit'

    export default {
        name: "List",
        components: {
            TableView
        },
        props: {
            headers: {
                type: Array,
                required: true
            },
            items: {
                type: Array,
                required: true
            },
            clickItem:{
                type: Function,
                required: false,
                default: () => {}
            }
        }
    }
</script>
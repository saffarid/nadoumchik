<template>

    <TableView :headers="[
                {name: 'Группа'},
            ]"
               :items="groups">
        <template #row="{item}">
            <tr @click="clickGroup(item)">
                <td>{{item.name}}</td>
            </tr>
        </template>
    </TableView>

</template>

<script>

    import {
        TableView,
    }                       from "saffarid-ui-kit"

    import GroupDescription from "./GroupDescription";

    export default {
        name: "ListGroups",
        components: {
            GroupDescription,
            TableView,
        },
        props: {
            groups: {
                type: Object,
                required: true
            }
        },
        setup(props, context) {

            const clickGroup = (group) => {
                context.emit('clickGroup', group)
            }

            return {
                clickGroup,
            }
        }
    }
</script>


<style lang="scss" scoped>

    .toolbar {
        display: inline-grid;
    }

</style>
<template>
    <div>
        <BorderPane>

            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" text="Создать" @click="newGroup"/>
                    <Button class="text-button" text="Редактировать"/>
                    <Button class="text-button" text="Удалить"/>
                </div>
            </template>

            <template v-slot:center>
                <ListGroups :groups="groups" @clickGroup="updateGroup"/>
            </template>

        </BorderPane>

        <Popup
                v-if="showingGroupShow"
                @close="showingGroupShow = false">
            <template v-slot:content>
                <GroupDescription :group="showingGroup"/>
            </template>
        </Popup>
    </div>
</template>

<script>
    import {
        inject,
        reactive,
        ref
    }                       from "vue";
    import {
        BorderPane,
        Button,
        Popup
    }                       from 'saffarid-ui-kit'
    import ListGroups       from "./ListGroups";
    import GroupDescription from "./GroupDescription";

    export default {
        name: "Groups",
        components: {
            BorderPane,
            Button,
            Popup,
            ListGroups,
            GroupDescription
        },
        setup() {
            const api = inject('$api')
            const workObject = inject('workObject')
            const groups = inject('groups')

            const showingGroupShow = ref(false)
            const showingGroup = reactive({})

            const updateGroup = (group) => {
                workObject.objectCopy(group, showingGroup)
                showingGroupShow.value = true
            }

            const newGroup = () => {
                workObject.objectCopy(api.DATABASE.collections.groups.newObject, showingGroup)
                showingGroupShow.value = true
            }

            return {
                groups,
                showingGroup,
                showingGroupShow,
                updateGroup,
                newGroup
            }
        }
    }
</script>

<style scoped>

</style>
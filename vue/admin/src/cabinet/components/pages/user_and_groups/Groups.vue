<template>
    <div>
        <BorderPane>

            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" text="Создать" @click="newGroup"/>
                </div>
            </template>

            <template v-slot:center>
                <ListGroups :groups="groups" @clickGroup="updateGroup"/>
            </template>

        </BorderPane>
        <GroupDescription
                v-if="showGroupDescription"
                @dismiss="closeGroupDescription"
                :group="showingGroup"
                :send="send"
        />
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
    }                       from 'saffarid-ui-kit'
    import ListGroups       from "./ListGroups";
    import GroupDescription from "./GroupDescription";
    import {useStore}       from 'vuex'

    export default {
        name: "Groups",
        components: {
            BorderPane,
            Button,
            ListGroups,
            GroupDescription
        },
        setup() {
            const store = useStore
            const api = inject('$api')
            const workObject = inject('workObject')
            const groups = inject('groups')

            const showGroupDescription = ref(false)
            const showingGroup = reactive({})

            const updateGroup = (group) => {
                workObject.objectCopy(group, showingGroup)
                showGroupDescription.value = true
            }

            const newGroup = () => {
                workObject.objectCopy(api.NEW_OBJECTS.group, showingGroup)
                showGroupDescription.value = true
            }

            const closeGroupDescription = () => {
                showGroupDescription.value = false
                for (const key of Object.keys(showingGroup)) {
                    delete showingGroup[key]
                }
            }

            const send = () => store.dispatch('sendGroup', {
                group: showingGroup,
                customThen: () => showGroupDescription.value = false
            })

            return {
                groups,
                showingGroup,
                showGroupDescription,
                closeGroupDescription,
                updateGroup,
                newGroup,
                send,
            }
        }
    }
</script>

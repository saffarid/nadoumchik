<template>
    <div>
        <BorderPane>

            <template v-slot:top>
                <div class="tool-bar">
                    <Button class="text-button" text="Создать" @click="newGroup"/>
                </div>
            </template>

            <template v-slot:center>
                <List :headers="[
                                    {name: 'Группа'},
                                    {name: 'Описание'},
                                ]"
                      :items="groupsList"
                      :click-item="updateGroup"/>
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
        computed,
        inject,
        onActivated,
        onBeforeUnmount,
        onDeactivated,
        reactive,
        ref
    }                       from "vue";
    import {
        BorderPane,
        Button,
    }                       from 'saffarid-ui-kit'
    import GroupDescription from "./GroupDescription";
    import List             from "@/cabinet/components/pages/user_and_groups/List";
    import {useStore}       from 'vuex';

    export default {
        name: "Groups",
        components: {
            BorderPane,
            Button,
            List,
            GroupDescription
        },
        setup() {
            const store = useStore()
            const api = inject('$api')
            const workObject = inject('workObject')

            const groups = computed(() => Object.values(store.getters.groups))

            const showGroupDescription = ref(false)
            const showingGroup = reactive({})

            onBeforeUnmount(() => {
                groups.value = Object.values(store.getters.groups)
            })

            onActivated(() => {
                groups.value = Object.values(store.getters.groups)
            })

            onDeactivated(() => {

            })

            const groupsList = computed(() => {
                const res = []
                for(const group of Object.values(groups.value)){
                    res.push({
                        _id: group._id,
                        name: group.name,
                        desc: group.desc
                    })
                }
                return res
            })

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
                customThen: closeGroupDescription
            })

            return {
                groups,
                showingGroup,
                showGroupDescription,
                closeGroupDescription,
                updateGroup,
                newGroup,
                send,
                groupsList
            }
        }
    }
</script>

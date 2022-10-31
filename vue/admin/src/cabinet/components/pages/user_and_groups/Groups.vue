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
    import {asyncRequest}   from "@/js/web";

    export default {
        name: "Groups",
        components: {
            BorderPane,
            Button,
            ListGroups,
            GroupDescription
        },
        setup() {
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
                for(const key of Object.keys(showingGroup)){
                    delete showingGroup[key]
                }
            }

            const send = () => {
                if (showingGroup._id) {
                    //Редактируем
                    asyncRequest(
                        api.MODEL_REQUESTS.work_e(api.ESSENCE.group.name, api.ESSENCE.group.actions.edit),
                        JSON.stringify(showingGroup)
                    )
                        .then(data => {
                            if (data.responseCode == api.CODES_RESPONSE.updated.responseCode) {

                            }
                        })
                        .catch(err => console.log(err))
                }
                //Добавляем
                asyncRequest(
                    api.MODEL_REQUESTS.work_e(api.ESSENCE.group.name, api.ESSENCE.group.actions.addNew),
                    JSON.stringify(showingGroup)
                )
                    .then(data => {
                        if (data.responseCode == api.CODES_RESPONSE.created.responseCode) {
                            groups.value.push(data.datas)
                            showingGroupShow.value = false
                        }
                    })
                    .catch(err => console.log(err))
            }

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

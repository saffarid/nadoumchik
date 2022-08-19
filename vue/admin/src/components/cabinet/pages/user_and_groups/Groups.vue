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

        <Popup
                v-if="showingGroupShow"
                @close="showingGroupShow = false">
            <template v-slot:content>
                <GroupDescription
                        :group="showingGroup"
                        :send="send"
                />
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
    import {asyncRequest}   from "@/js/web";

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
                workObject.objectCopy(api.NEW_OBJECTS.group, showingGroup)
                showingGroupShow.value = true
            }

            const send = () => {
                if(showingGroup._id){
                    //Редактируем
                    asyncRequest(
                        api.MODEL_REQUESTS.work_e(api.ESSENCE.group.name, api.ESSENCE.group.actions.edit),
                        JSON.stringify(showingGroup)
                    )
                    .then(data => {
                        if(data.responseCode == api.CODES_RESPONSE.updated.responseCode){

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
                        if(data.responseCode == api.CODES_RESPONSE.created.responseCode){
                            groups.value.push(data.datas)
                            showingGroupShow.value = false
                        }
                    })
                    .catch(err => console.log(err))
            }

            return {
                groups,
                showingGroup,
                showingGroupShow,
                updateGroup,
                newGroup,
                send,
            }
        }
    }
</script>

<style scoped>

</style>
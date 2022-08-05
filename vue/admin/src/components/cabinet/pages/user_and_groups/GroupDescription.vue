<template>
    <BorderPane>

        <template v-slot:top>
            <div class="tool-bar" style="padding-left:2px">
                <Button class="text-button" :text="group._id == null ? 'ОТПРАВИТЬ' : 'ОБНОВИТЬ'"/>
            </div>
        </template>

        <template v-slot:center>
            <Tabs :options="{ useUrlFragment: false }">
                <Tab name="Описание">
                    <Row>
                        <TextLabel label="Наименование"/>
                        <TextField :model-value="group.name"/>
                    </Row>
                    <Row>
                        <TextLabel label="Описание"/>
                        <TextField :model-value="group.description"/>
                    </Row>
                </Tab>
                <Tab name="Права доступа">
                    <Row>
                        <TextLabel label="Пользователи"/>
                        <ComboBox :options="accessRights" :model-value="group.rights.users.value"
                                  @update:modelValue=""/>
                    </Row>
                    <Row>
                        <TextLabel label="Группы"/>
                        <ComboBox :options="accessRights" :model-value="group.rights.groups.value"/>
                    </Row>
                    <Row>
                        <TextLabel label="Публикации"/>
                        <ComboBox :options="accessRights" :model-value="group.rights.publications.value"/>
                    </Row>
                    <Row>
                        <TextLabel label="Темы публикаций"/>
                        <ComboBox :options="accessRights" :model-value="group.rights.themesOfPublication.value"/>
                    </Row>
                    <Row>
                        <TextLabel label="Система"/>
                        <ComboBox :options="accessRights" :model-value="group.rights.system.value"/>
                    </Row>
                </Tab>
                <Tab name="Пользователи">
                    <Users :users="groupsUsers"/>
                </Tab>
            </Tabs>
        </template>

    </BorderPane>
</template>

<script>
    import {
        reactive,
        inject,
        computed
    }            from 'vue'
    import {
        Tabs,
        Tab
    }            from 'vue3-tabs-component'
    import {
        BorderPane,
        Button,
        ComboBox,
        TextLabel,
        TextField,
        Row
    }            from 'saffarid-ui-kit'
    import Users from "@/components/cabinet/pages/user_and_groups/ListUsers";

    export default {
        name: "GroupDescription",
        components: {
            BorderPane,
            Button,
            Users,
            ComboBox,
            Tabs,
            Tab,
            TextLabel,
            TextField,
            Row
        },
        props: {
            group: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            const api = inject('$api')

            const _users = inject('users')

            const accessRights = reactive([])
            console.log(props.group)
            const formAccessRights = () => {
                for (const key of Object.keys(api.ACCESS_RIGHTS)) {
                    accessRights.push({
                        value: api.ACCESS_RIGHTS[key],
                        label: api.ACCESS_RIGHTS[key],
                        selected: false,
                        disabled: false
                    })
                }
            }

            const rights = computed(() => {
                return {}
            })

            const groupsUsers = computed(() => {
                const res = []

                for (const user of _users.value) {
                    if (user.group.name === props.group.name) res.push(user)
                }

                return res
            })

            formAccessRights()

            return {
                accessRights,
                groupsUsers
            }

        }
    }
</script>

<style lang="scss" scoped>


</style>
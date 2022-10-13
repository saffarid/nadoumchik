<template>
    <BorderPane>

        <template v-slot:top>
            <div class="tool-bar" style="padding-left:2px">
                <Button class="text-button" :text="group._id == null ? 'ОТПРАВИТЬ' : 'ОБНОВИТЬ'" @click="send"/>
            </div>
        </template>

        <template v-if="group._id != null" v-slot:center>
            <Tabs :options="{ useUrlFragment: false }">
                <Tab name="Настройка группы">
                    <Card title="Описание">
                        <Row>
                            <span>Наименование</span>
                            <TextField v-model="group.name"/>
                        </Row>
                        <Row>
                            <span>Описание</span>
                            <TextField v-model="group.description"/>
                        </Row>
                    </Card>
                    <Card title="Права доступа">
                        <Row>
                            <span>Пользователи</span>
                            <ComboBox :options="accessRights" v-model="group.rights.users.value"/>
                        </Row>
                        <Row>
                            <span>Группы</span>
                            <ComboBox :options="accessRights" v-model="group.rights.groups.value"/>
                        </Row>
                        <Row>
                            <span>Публикации</span>
                            <ComboBox :options="accessRights" v-model="group.rights.publications.value"/>
                        </Row>
                        <Row>
                            <span>Темы публикаций</span>
                            <ComboBox :options="accessRights" v-model="group.rights.themesOfPublication.value"/>
                        </Row>
                        <Row>
                            <span>Система</span>
                            <ComboBox :options="accessRights" :model-value="group.rights.system.value"/>
                        </Row>
                    </Card>
                </Tab>
                <Tab name="Пользователи">
                    <Users :users="groupsUsers"/>
                </Tab>
            </Tabs>
        </template>
        <template v-else v-slot:center>
            <div>
                <Card title="Описание">
                    <Row>
                        <span>Наименование</span>
                        <TextField v-model="group.name"/>
                    </Row>
                    <Row>
                        <span>Описание</span>
                        <TextField v-model="group.description"/>
                    </Row>
                </Card>
                <Card title="Права доступа">
                    <Row>
                        <span>Пользователи</span>
                        <ComboBox :options="accessRights" v-model="group.rights.users.value"/>
                    </Row>
                    <Row>
                        <span>Группы</span>
                        <ComboBox :options="accessRights" v-model="group.rights.groups.value"/>
                    </Row>
                    <Row>
                        <span>Публикации</span>
                        <ComboBox :options="accessRights" v-model="group.rights.publications.value"/>
                    </Row>
                    <Row>
                        <span>Темы публикаций</span>
                        <ComboBox :options="accessRights" v-model="group.rights.themesOfPublication.value"/>
                    </Row>
                    <Row>
                        <span>Система</span>
                        <ComboBox :options="accessRights" :model-value="group.rights.system.value"/>
                    </Row>
                </Card>
            </div>
        </template>

    </BorderPane>
</template>

<script>
    import {
        reactive,
        inject,
        computed
    }                     from 'vue'
    import {
        Tabs,
        Tab
    }                     from 'vue3-tabs-component'
    import {
        BorderPane,
        Button,
        Card,
        ComboBox,
        TextField,
        Row
    }                     from 'saffarid-ui-kit'
    import Users          from "@/cabinet/components/pages/user_and_groups/ListUsers";
    import {asyncRequest} from "@/js/web";

    export default {
        name: "GroupDescription",
        components: {
            BorderPane,
            Button,
            Users,
            Card,
            ComboBox,
            Tabs,
            Tab,
            TextField,
            Row
        },
        props: {
            group: {
                type: Object,
                required: true
            },
            send: {
                type: Function,
                required: true
            },
        },
        setup(props, context) {
            const api = inject('$api')

            const _users = inject('users')

            const accessRights = reactive([])

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

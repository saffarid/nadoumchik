<template>
    <Popup class="group_description" @close="$emit('dismiss')">
        <template v-slot:header>
            <div class="title">
                <span>Создание новой группы</span>
            </div>
        </template>


        <template v-if="group._id != null" v-slot:content>
            <Tabs :options="{ useUrlFragment: false }">
                <Tab name="Настройка группы">
                    <div class="popup_content">
                    <TitlePane title="Описание">
                        <Row>
                            <span>Наименование</span>
                            <TextField v-model="group.name"/>
                        </Row>
                        <Row>
                            <span>Описание</span>
                            <TextField v-model="group.description"/>
                        </Row>
                    </TitlePane>
                    <TitlePane title="Права доступа">
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
                    </TitlePane>
                    </div>
                </Tab>
                <Tab name="Пользователи">
                    <Users :users="groupsUsers"/>
                </Tab>
            </Tabs>
        </template>
        <template v-else v-slot:content>
            <div class="popup_content">
                <TitlePane title="Описание">
                    <Row>
                        <span>Наименование</span>
                        <TextField v-model="group.name"/>
                    </Row>
                    <Row>
                        <span>Описание</span>
                        <TextField v-model="group.description"/>
                    </Row>
                </TitlePane>
                <TitlePane title="Права доступа">
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
                </TitlePane>
            </div>
        </template>


        <template v-slot:footer>
            <div class="tool-bar">
                <Button class="text-button"
                        :disabled="group.name == ''"
                        :text="group._id == null ? 'СОЗДАТЬ' : 'ОБНОВИТЬ'"
                        @click="send"/>
            </div>
        </template>
    </Popup>
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
        Button,
        TitlePane,
        ComboBox,
        TextField,
        Popup
    }            from 'saffarid-ui-kit'
    import Users from "@/cabinet/components/pages/user_and_groups/ListUsers";
    import Row   from "@/components/commons/Row";

    export default {
        name: "GroupDescription",
        components: {
            Button,
            Users,
            TitlePane,
            ComboBox,
            Tabs,
            Tab,
            TextField,
            Row,
            Popup
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

<style lang="scss">

    .group_description {
        z-index: 60;

        .popup {
            grid-template-rows: 30px auto var(--toolbar_h);

            height: min-content !important;
            width: 50vw !important;
            border-radius: 10px;

            padding: 5px;

            .title {
                display: flex;
                align-items: center;
                align-content: center;
            }

            .popup_content {
                display: grid;
                row-gap: 5px;
                align-content: start;

                .title_pane .content {
                    row-gap: 2px;
                    padding: 2px;
                    .row {
                        grid-template-columns: repeat(2, minmax(150px, 300px));
                    }
                }
            }

            .tool-bar {
                height: var(--toolbar_h);
            }
        }
    }

</style>
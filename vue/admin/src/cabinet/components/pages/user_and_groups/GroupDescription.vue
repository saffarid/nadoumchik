<template>
    <Popup class="group-description" @close="$emit('dismiss')">
        <template v-slot:default>
            <TitlePane class="group-description-title-pane"
                       :title="group._id != null ? `Группа ${group.name}` : 'Новая группа'">
                <Tabs :options="{ useUrlFragment: false }">
                    <Tab name="Настройка группы">
                        <div class="popup-content">
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
                    <Tab v-if="group._id != null"
                         name="Пользователи">
                        <List v-if="groupsUsers.length != 0"
                              :headers="[
                                            {name: 'Пользователь'},
                                            {name: 'Группа'},
                                        ]"
                              :items="groupsUsers"/>
                        <span v-else>Нет пользователей в этой группе</span>
                    </Tab>
                </Tabs>
                <div class="tool-bar">
                    <Button class="text-button"
                            :disabled="group.name == ''"
                            :text="group._id != null ? 'ОБНОВИТЬ' : 'СОЗДАТЬ'"
                            @click="send"/>
                </div>
            </TitlePane>
        </template>
    </Popup>
</template>

<script>
    import {
        reactive,
        inject,
        computed
    }                 from 'vue'
    import {
        Tabs,
        Tab
    }                 from 'vue3-tabs-component'
    import {
        Button,
        TitlePane,
        ComboBox,
        TextField,
        Popup
    }                 from 'saffarid-ui-kit'
    import Row        from "@/components/commons/Row";
    import {useStore} from 'vuex'
    import List       from "@/cabinet/components/pages/user_and_groups/List";

    export default {
        name: "GroupDescription",
        components: {
            List,
            Button,
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
        setup(props) {
            const store = useStore()
            const api = inject('$api')
            const accessRights = reactive([])
            const users = store.getters.users

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

            const groupsUsers = computed(() => {
                const res = []
                for (const user of Object.values(users)) {
                    if (user.group.name == props.group.name) {
                        res.push({
                            _id: user._id,
                            name: `${user.personal.f_name} ${user.personal.s_name}`,
                            desc: user.group.name
                        })
                    }
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

    .group-description {
        z-index: 60;

        .popup-body {
            width: 50vw !important;
            border-radius: 10px;

            .group-description-title-pane {
                background-color: white !important;

                .content {
                    padding: 2px 2px 2px 10px;

                    .popup-content {
                        display: grid;
                        row-gap: 5px;

                        min-height: 230px;
                        overflow-y: auto;

                        .title-pane {
                            width: calc(100% - 12px) !important;

                            .content {
                                padding: 2px;

                                .row {
                                    grid-template-columns: repeat(2, minmax(150px, 300px));
                                }
                            }
                        }
                    }
                }


            }
        }
    }


</style>
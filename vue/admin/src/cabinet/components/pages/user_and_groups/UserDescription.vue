<template>
    <Popup class="user_description" @close="$emit('dismiss')">
        <template v-slot:header>
            <div class="title">
                <span>Создание нового пользователя</span>
            </div>
        </template>
        <template v-slot:content>
            <div>
                <TitlePane title="Аутентификация">
                    <Row>
                        <span>Логин</span>
                        <TextField v-model="user.auth.name"/>
                    </Row>
                    <Row v-if="user._id == null">
                        <span>Пароль</span>
                        <TextField v-model="user.auth.pass"/>
                    </Row>
                </TitlePane>
                <TitlePane title="Персональные настройки">
                    <Row>
                        <span>Псевдоним</span>
                        <TextField v-model="user.personal.nickname"/>
                    </Row>

                    <Row>
                        <span>Группа пользователей</span>
                        <ComboBox :options="_groups" :modelValue="user.group._id"
                                  @update:modelValue="changeGroup"/>
                    </Row>
                </TitlePane>
            </div>
        </template>
        <template v-slot:footer>
            <div class="tool-bar" style="padding-left:2px">
                <Button class="text-button" :text="user._id == null ? 'ОТПРАВИТЬ' : 'ОБНОВИТЬ'" @click="send"/>
            </div>
        </template>
    </Popup>

</template>

<script>
    import {
        inject,
        reactive
    }          from 'vue'
    import {
        Button,
        TitlePane,
        ComboBox,
        TextField,
        Popup
    }          from 'saffarid-ui-kit'
    import Row from "@/components/commons/Row";

    export default {
        name: "UserDescription",
        components: {
            Button,
            TitlePane,
            ComboBox,
            Row,
            TextField,
            Popup
        },
        props: {
            user: {
                type: Object,
                required: true
            },
            send: {
                type: Function,
                required: true
            }
        },
        setup(props) {
            const groups = inject('groups')

            const _groups = reactive([])
            const formGroups = () => {
                _groups.push({
                    value: -1,
                    label: 'Выберите группу пользователя',
                    selected: false,
                    disabled: true
                })
                for (let i = 0; i < groups.value.length; i++) {
                    _groups.push({
                        value: (groups.value)[i]._id,
                        label: (groups.value)[i].name,
                        selected: false,
                        disabled: false
                    })
                }
            }

            const changeGroup = (id) => {
                for (let i = 0; i < groups.value.length; i++) {
                    if (id == (groups.value)[i]._id) {
                        props.user.group = (groups.value)[i]
                        break
                    }
                }
            }

            formGroups()

            return {
                _groups,
                changeGroup
            }
        }
    }
</script>

<style lang="scss">

    .user_description {
        z-index: 60;

        .popup {
            grid-template-rows: 30px auto var(--toolbar_h);

            height: 50vh !important;
            width: 50vw !important;
            border-radius: 10px;

            padding: 5px;

            .title {
                display: flex;
                align-items: center;
                align-content: center;
            }

            .title_pane .content {
                row-gap: 2px;
                .row {
                    grid-template-columns: repeat(2, minmax(150px, 300px));
                }
            }



            .tool-bar {
                height: var(--toolbar_h);
            }
        }
    }

</style>
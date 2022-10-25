<template>
    <Popup class="user_description" @close="$emit('dismiss')">
        <template v-slot:header>
            <div class="title">
                <span>Новый пользователь</span>
            </div>
        </template>
        <template v-slot:content>
            <div class="popup_content">
                <TitlePane title="Аутентификация" v-if="user._id == null">
                    <Row>
                        <span>Логин</span>
                        <TextField v-model="user.auth.name"/>
                    </Row>
                    <Row>
                        <span>Пароль</span>
                        <TextField v-model="user.auth.pass"/>
                    </Row>
                </TitlePane>
                <TitlePane title="Персональные настройки">
                    <Row>
                        <span>Группа пользователей</span>
                        <ComboBox
                                  :options="_groups" :modelValue="user.group._id"
                                  @update:modelValue="changeGroup"/>
                    </Row>

                    <Row>
                        <span>Имя</span>
                        <TextField :disabled="user._id != null" v-model="user.personal.f_name"/>
                    </Row>
                    <Row>
                        <span>Фамилия</span>
                        <TextField :disabled="user._id != null" v-model="user.personal.s_name"/>
                    </Row>
                    <Row>
                        <span>Почта</span>
                        <TextField :disabled="user._id != null" v-model="user.personal.mail"/>
                    </Row>

                    <Row>
                        <span>О себе</span>
                        <textarea :disabled="user._id != null" v-model="user.personal.aboutSelf"/>
                    </Row>
                </TitlePane>
            </div>
        </template>
        <template v-slot:footer>
            <div class="tool-bar">
                <Button class="text-button"
                        :disabled="sendIsDisabled"
                        :text="user._id == null ? 'СОЗДАТЬ' : 'ОБНОВИТЬ'"
                        @click="send"/>
            </div>
        </template>
    </Popup>

</template>

<script>
    import {
        computed,
        inject,
        reactive
    }                          from 'vue'
    import {
        Button,
        TitlePane,
        ComboBox,
        TextField,
        Popup
    }                          from 'saffarid-ui-kit'
    import Row                 from "@/components/commons/Row";
    import {hasValueTextField} from "@/js/checker";


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

            const sendIsDisabled = computed(() => {
                let isEnabled = (hasValueTextField(props.user.personal.f_name) && hasValueTextField(props.user.personal.s_name))

                if(isEnabled && (props.user._id == undefined || props.user._id == null)) {
                    isEnabled = isEnabled && (hasValueTextField(props.user.auth.name) && hasValueTextField(props.user.auth.pass))
                }

                return !isEnabled
            })

            return {
                _groups,
                changeGroup,
                sendIsDisabled
            }
        }
    }
</script>

<style lang="scss">

    .user_description {
        z-index: 60;

        .popup {
            grid-template-rows: 30px auto var(--toolbar_h);

            height: min-content !important;
            width: 50vw !important;


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

                        textarea {
                            resize: none;
                            min-height: 100px;
                            max-height: 100px;
                            width: calc(100% - 6px);
                            min-width: 150px;
                            max-width: 294px;
                        }
                    }
                }
            }

            .tool-bar {
                height: var(--toolbar_h);
            }
        }
    }

</style>
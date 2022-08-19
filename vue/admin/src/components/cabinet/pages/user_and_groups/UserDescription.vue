<template>

    <BorderPane>
        <template v-slot:top>
            <div class="tool-bar" style="padding-left:2px">
                <Button class="text-button" :text="user._id == null ? 'ОТПРАВИТЬ' : 'ОБНОВИТЬ'" @click="send"/>
            </div>
        </template>

        <template v-slot:center>
            <div>
                <Card title="Аутентификация">
                    <Row>
                        <TextLabel :label="'Логин'"/>
                        <TextField v-model="user.auth.name"/>
                    </Row>
                    <Row v-if="user._id == null">
                        <TextLabel :label="'Пароль'"/>
                        <TextField v-model="user.auth.pass"/>
                    </Row>
                </Card>
                <Card title="Персональные настройки">
                    <Row>
                        <TextLabel :label="'Псевдоним'"/>
                        <TextField v-model="user.personal.nickname"/>
                    </Row>

                    <Row>
                        <TextLabel :label="'Группа пользователей'"/>
                        <ComboBox :options="_groups" :modelValue="user.group._id" @update:modelValue="changeGroup"/>
                    </Row>
                </Card>
            </div>
        </template>

    </BorderPane>


</template>

<script>
    import {
        inject,
        reactive
    } from 'vue'
    import {
        Button,
        BorderPane,
        Card,
        ComboBox,
        TextLabel,
        TextField
    } from 'saffarid-ui-kit'

    import Row from "@/components/commons/Row";

    export default {
        name: "UserDescription",
        components: {
            Button,
            BorderPane,
            Card,
            ComboBox,
            Row,
            TextLabel,
            TextField
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

<style scoped>

</style>
<template>
    <div class="user_config">
        <div class="password title_pane">
            <Button class="text-button"
                    text="Сменить пароль"/>
        </div>

        <TitlePane title="Редактировать профиль">
            <Row>
                <span>Имя</span>
                <TextField v-model="user.personal.f_name"/>
            </Row>
            <Row>
                <span>Фамилия</span>
                <TextField v-model="user.personal.s_name"/>
            </Row>
            <Row>
                <span>Почта</span>
                <TextField v-model="user.personal.mail"/>
            </Row>

            <Row>
                <span>О себе</span>
                <textarea v-model="user.personal.aboutSelf"/>
            </Row>

            <Button class="text-button"
                    text="СОХРАНИТЬ"
                    @click="updateUser"/>
        </TitlePane>
    </div>
</template>

<script>
    import {
        Button,
        TitlePane,
        TextField
    }          from 'saffarid-ui-kit'
    import {
        inject
    }          from 'vue'
    import Row from "@/components/commons/Row";

    import {asyncRequest}  from "@/js/web";

    export default {
        name: "User",
        components: {
            Button,
            TitlePane,
            TextField,
            Row
        },
        setup() {
            const user = inject('user')
            const api = inject('$api')
            const workObject = inject('workObject')

            const updateUser = () => {

                asyncRequest(
                    api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.edit),
                    JSON.stringify(user.value)
                )
                .then(response => {
                    if(response.responseCode == api.CODES_RESPONSE.updated.responseCode){

                        alert('Профиль обновлен')

                    }
                })
                .catch(err => console.error(err))

            }

            return {
                updateUser,
                user
            }
        }
    }
</script>

<style lang="scss">

    .user_config {
        display: flex;
        gap: 5px;

        .text-button {
            width: 150px;
            max-width: 300px;
        }

        .title_pane {
            max-width: 604px;

            .content {
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

        .password {
            width: min-content;
            height: min-content;
            padding: 5px;
        }
    }

</style>
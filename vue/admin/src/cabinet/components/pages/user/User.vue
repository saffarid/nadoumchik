<template>
    <div class="user_config">
        <div class="password title_pane">
            <Button class="text-button"
                    text="Сменить пароль"
                    @click="showChangePassPopup"/>
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

        <Popup class="change_pass"
               v-if="isShowChangePass"
               @close="closeChangePassPopup">
            <template v-slot:header>
                <div class="header">
                    <span>Смена пароля</span>
                </div>
            </template>
            <template v-slot:content>
                <div class="change_pass_form">
                    <Row>
                        <span>Текущий пароль</span>
                        <TextField v-model="newOldPass.oldPass"/>
                    </Row>
                    <Row>
                        <span>Новый пароль</span>
                        <TextField v-model="newOldPass.newPass"/>
                    </Row>
                    <Row>
                        <span>Повторите новый пароль</span>
                        <TextField v-model="newOldPass.checkNewPass"/>
                    </Row>
                </div>
            </template>
            <template v-slot:footer>
                <div class="tool-bar">
                    <Button class="text-button"
                            text="ОБНОВИТЬ"
                            :disabled="isDisabledChangePassBtn"
                            @click="changePass"/>
                </div>
            </template>
        </Popup>
    </div>
</template>

<script>
    import {
        Button,
        TitlePane,
        TextField,
        Popup
    }                          from 'saffarid-ui-kit'
    import {
        computed,
        inject,
        ref,
        reactive
    }                          from 'vue'
    import Row                 from "@/components/commons/Row";
    import {asyncRequest}      from "@/js/web";
    import {hasValueTextField} from "@/js/checker";

    export default {
        name: "User",
        components: {
            Button,
            TitlePane,
            TextField,
            Row,
            Popup
        },
        setup() {
            const user = inject('user')
            const api = inject('$api')
            const workObject = inject('workObject')

            console.log(user)

            const isShowChangePass = ref(false)
            const newOldPass = reactive({
                _id: user.value._id,
                newPass: '',
                checkNewPass: '',
                oldPass: ''
            })

            /**
             * Функция отправляет запрос на сервер о изменении профиля пользователя
             * */
            const updateUser = () => {

                asyncRequest(
                    api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.edit),
                    JSON.stringify(user.value)
                )
                    .then(response => {
                        if (response.responseCode == api.CODES_RESPONSE.updated.responseCode) {

                            alert('Профиль обновлен')

                        }
                    })
                    .catch(err => console.error(err))

            }

            const showChangePassPopup = () => {
                isShowChangePass.value = true
            }

            const closeChangePassPopup = () => {
                isShowChangePass.value = false
                newOldPass.newPass = ''
                newOldPass.oldPass = ''
            }

            /**
             * Функция отправляет запрос на сервер об изменении пароля
             * */
            const changePass = () => {
                asyncRequest(
                    api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.changePass),
                    JSON.stringify(newOldPass))
                    .then(response => {
                        switch (response.responseCode) {
                            case api.CODES_RESPONSE.notFound.responseCode : {
                                alert('Не найден такой пользователь')
                                break
                            }
                            case api.CODES_RESPONSE.notAcceptable.responseCode : {
                                alert('Неверно введён текущий пароль')
                                break
                            }
                            case api.CODES_RESPONSE.notImplemented.responseCode : {
                                alert('Не удалось изменить ваш пароль')
                                break
                            }
                            case api.CODES_RESPONSE.updated.responseCode : {
                                alert('Ваш пароль изменен')
                                closeChangePassPopup()
                                break
                            }
                        }
                    })
            }

            const isDisabledChangePassBtn = computed(() => {
                return !(hasValueTextField(newOldPass.oldPass) &&
                    hasValueTextField(newOldPass.newPass) &&
                    hasValueTextField(newOldPass.checkNewPass) &&
                    newOldPass.newPass.localeCompare(newOldPass.checkNewPass) == 0)
            })

            return {
                changePass,
                closeChangePassPopup,
                isDisabledChangePassBtn,
                isShowChangePass,
                newOldPass,
                showChangePassPopup,
                updateUser,
                user
            }
        }
    }
</script>

<style lang="scss">

    $row_columns: repeat(2, minmax(150px, 300px));

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
                    grid-template-columns: $row_columns;

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

        .change_pass {
            height: 100vh;
            width: 100vw;
            z-index: 60;

            .popup {
                height: min-content !important;
                width: 50vw !important;
                row-gap: 2px;

                .header {
                    margin: 2px 0;
                }

                .change_pass_form {
                    display: grid;
                    row-gap: 2px;
                }

                .row {
                    grid-template-columns: $row_columns;
                }
            }
        }
    }

</style>
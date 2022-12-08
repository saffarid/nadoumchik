<template>
    <div class="user-config">
        <div class="password title-pane">
            <Button class="text-button"
                    text="Сменить пароль"
                    @click="showChangePassPopup"/>
        </div>

        <TitlePane title="Редактировать профиль">
            <Row>
                <span>Имя</span>
                <input v-model="user.personal.f_name"/>
            </Row>
            <Row>
                <span>Фамилия</span>
                <input v-model="user.personal.s_name"/>
            </Row>
            <Row>
                <span>Почта</span>
                <input v-model="user.personal.mail"/>
            </Row>

            <Row>
                <span>О себе</span>
                <textarea v-model="user.personal.aboutSelf"/>
            </Row>

            <Button class="text-button"
                    text="СОХРАНИТЬ"
                    @click="updateUser"/>
        </TitlePane>

        <Popup class="change-pass"
               v-if="isShowChangePass"
               @close="closeChangePassPopup">
            <template v-slot:default>
                <TitlePane title="Смена пароля">
                    <div class="change-pass-form">
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
                    <div class="tool-bar">
                        <Button class="text-button"
                                text="ОБНОВИТЬ"
                                :disabled="isDisabledChangePassBtn"
                                @click="changePass"/>
                    </div>
                </TitlePane>
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
        reactive,
        onBeforeUnmount,
        onActivated,
        onDeactivated,
    }                          from 'vue'
    import Row                 from "@/components/commons/Row";
    import {useStore}          from 'vuex'
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
            const store = useStore()
            const workObject = inject('workObject')
            const user = reactive({})
            workObject.objectCopy(store.getters.user, user)

            onBeforeUnmount(() => {
                workObject.objectCopy(store.getters.user, user)
            })

            onActivated(() => {
                workObject.objectCopy(store.getters.user, user)
            })

            onDeactivated(() => {

            })

            const isShowChangePass = ref(false)
            const newOldPass = reactive({
                _id: user._id,
                newPass: '',
                checkNewPass: '',
                oldPass: ''
            })

            /**
             * Функция отправляет запрос на сервер о изменении профиля пользователя
             * */
            const updateUser = () => store.dispatch('editUser', user)

            const showChangePassPopup = () => {
                isShowChangePass.value = true
            }

            const closeChangePassPopup = () => {
                isShowChangePass.value = false
                newOldPass.newPass = ''
                newOldPass.checkNewPass = ''
                newOldPass.oldPass = ''
            }

            /**
             * Функция отправляет запрос на сервер об изменении пароля
             * */
            const changePass = () => {
                console.log(newOldPass)
                store.dispatch('changePass', {
                    dataPass: newOldPass,
                    customThen: closeChangePassPopup
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
                user,
            }
        }
    }
</script>

<style lang="scss">

    $row_columns: repeat(2, minmax(150px, 300px));

    .user-config {
        display: flex;
        gap: 5px;

        .text-button {
            width: 150px;
            max-width: 300px;
        }

        .title-pane {
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

        .change-pass {
            height: 100vh;
            width: 100vw;
            z-index: 60;

            .popup-body {
                height: min-content !important;
                width: 50vw !important;
                row-gap: 2px;

                .title-pane {
                    max-width: 100%;

                    .change-pass-form {
                        display: grid;
                        row-gap: 2px;
                    }

                    .row {
                        grid-template-columns: $row_columns;
                    }
                }
            }
        }
    }

</style>
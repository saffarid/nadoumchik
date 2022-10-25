<template>
    <div v-if="isShow" class="auth-screen" @keyup.enter="auth">
        <div class="auth-form">
            <div class="header-auth">
                <Logo :x="0" :y="0" :height="50" :width="50"/>
                <span>#НАДОУМЧИК</span>
            </div>
            <div class="form">
                <TextField
                        v-model.trim="user.name"
                        :type="'text'"
                        :placeholder="'Имя пользователя'"
                />
                <TextField
                        v-model.trim="user.pass"
                        :type="'password'"
                        :placeholder="'Пароль'"
                />
            </div>
            <div class="buttons-bar">
                <Button
                        :disabled="enterIsDisabled"
                        @click="auth"
                        class="text-button enter"
                        text="ВОЙТИ"/>
                <Button
                        @click="clear"
                        class="text-button clear"
                        text="ОЧИСТИТЬ"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        Button,
        TextField,
    }           from 'saffarid-ui-kit'
    import Logo from "@/assets/img/logo";
    import {
        computed,
        ref,
        inject,
        reactive,
        watch
    }           from 'vue'
    import {
        asyncRequest,
        getUser,
        setUser,
        storages
    }           from "@/js/web";

    const hash = require('jshashes')

    export default {
        name: "Auth",
        components: {
            Button,
            Logo,
            TextField,
        },
        emit: ['successful'],
        setup(props, context) {
            const api = inject('$api')
            const workObject = inject('workObject')
            const isShow = ref(false)
            const user = reactive({
                name: '',
                pass: ''
            })

            let hasSessionUser = false
            let hasStorageUser = false
            let authStorageUser = false

            const checkUser = () => {
                const gettingUser = JSON.parse(getUser(storages.session))
                if (gettingUser == null) {
                    hasSessionUser = false

                    isShow.value = true
                    const localUser = JSON.parse(getUser(storages.local))

                    if (localUser == null) {
                        hasStorageUser = false
                        return
                    }
                    hasStorageUser = true

                    workObject.objectCopy(localUser, user)
                    authStorageUser = true
                }
                else {
                    hasSessionUser = true
                    sendUserAuth(gettingUser)
                }
            }

            const auth = () => {
                if (!authStorageUser) {
                    sendUserAuth(
                        {
                            name: user.name,
                            pass: new hash.SHA1().b64(user.pass)
                        })
                }
                else {
                    sendUserAuth(user)
                }
            }

            const sendUserAuth = (user) => {
                asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.user.name, api.ESSENCE.user.actions.auth), JSON.stringify(user))
                    .then(authSuccess)
            }

            const authSuccess = (value) => {
                if (value.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                    const findingUser = value.datas.findings
                    if (!hasSessionUser) setUser(storages.session, JSON.stringify({
                        name: user.name,
                        pass: new hash.SHA1().b64(user.pass)
                    }))
                    if (!hasStorageUser) setUser(storages.local, JSON.stringify({
                        name: user.name,
                        pass: new hash.SHA1().b64(user.pass)
                    }))

                    context.emit('successful', findingUser)
                }
                else {
                    isShow.value = true
                }
            }

            const clear = () => {
                user.name = ''
                user.pass = ''
            }

            watch(user, () => {
                authStorageUser = false
            })

            checkUser()

            const hasValueTextField = (field) => field != undefined && field != null && field != ''

            const enterIsDisabled = computed(() => {
                return !(hasValueTextField(user.name) && hasValueTextField(user.pass))
            })

            return {
                auth,
                clear,
                enterIsDisabled,
                user,
                isShow
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./src/assets/style/auth";
</style>
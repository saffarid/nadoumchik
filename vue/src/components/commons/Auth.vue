<template>
    <div v-if="isShow" class="auth-screen" @keyup.enter="auth">
        <div class="auth-form">
            <div class="auth-header">
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
    }                          from 'saffarid-ui-kit'
    import Logo                from "@/assets/img/logo";
    import {
        computed,
        ref,
        inject,
        reactive,
        watch
    }                          from 'vue'
    import {
        // asyncRequest,
        getUser,
        setUser,
        storages
    }                          from "@/js/web";
    import {hasValueTextField} from "@/js/checker";
    import {useStore}          from 'vuex'

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
            const store = useStore()

            const user = reactive({
                name: '',
                pass: ''
            })

            let hasSessionUser = false
            let hasLocalUser = false
            let authLocalUser = false

            const checkUser = () => {
                const sessionUser = JSON.parse(getUser(storages.session))
                const localUser = JSON.parse(getUser(storages.local))

                hasSessionUser = sessionUser != null
                hasLocalUser = localUser != null

                if (hasSessionUser) {
                    store.dispatch('auth', {user: sessionUser, customThen: authSuccess})
                }
                else {
                    if (hasLocalUser) {
                        workObject.objectCopy(localUser, user)
                    }

                    watch(user, () => {
                        authLocalUser = false
                    })

                    authLocalUser = true
                    isShow.value = true
                }
            }

            const auth = () => {
                let u = user
                if (!authLocalUser) {
                    u = {
                        name: user.name,
                        pass: new hash.SHA1().b64(user.pass)
                    }
                }
                store.dispatch('auth', {user: u, customThen: authSuccess})
            }


            const authSuccess = (value) => {
                if (value.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                    if (!hasSessionUser) {
                        setUser(
                            storages.session,
                            JSON.stringify({
                                name: user.name,
                                pass: (authLocalUser) ? (user.pass) : (new hash.SHA1().b64(user.pass))
                            }))
                    }
                    if (!hasLocalUser) {
                        setUser(
                            storages.local,
                            JSON.stringify({
                                name: user.name,
                                pass: new hash.SHA1().b64(user.pass)
                            }))
                    }
                }
                else {
                    isShow.value = true
                }
            }

            const clear = () => {
                user.name = ''
                user.pass = ''
            }

            checkUser()

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
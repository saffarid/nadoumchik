<template>
    <div class="auth-screen" @keyup.enter="auth">
        <div class="auth-form">
            <div class="header-auth">
                <Logo :x="0" :y="0" :height="50" :width="50"/>
                <TextLabel label="НАДОУМЧИК"/>
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
                        :disabled="user.name.localeCompare('') === 0 && user.pass.localeCompare('') === 0"
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
        TextLabel
    }                     from 'saffarid-ui-kit'
    import Logo           from "@/assets/img/logo";
    import {
        inject,
        reactive
    }                     from 'vue'
    import {
        asyncRequest,
        getUser,
        setUser,
        storages
    } from "@/js/web";

    const hash = require('jshashes')

    export default {
        name: "Auth",
        components: {
            Button,
            Logo,
            TextField,
            TextLabel
        },
        emit: ['successful'],
        setup(props, context) {
            const api = inject('$api')
            const workObject = inject('workObject')
            let userFromStorage = false
            const user = reactive({
                name: '',
                pass: ''
            })

            const checkUser = () => {
                const gettingUser = JSON.parse(getUser(storages.session))
                console.log(gettingUser)
                if(gettingUser == null) {
                    const localUser = JSON.parse(getUser(storages.local))
                    console.log(localUser)
                    if (localUser == null) return
                    workObject.objectCopy(localUser, user)
                    userFromStorage = true
                } else {
                    context.emit('successful', gettingUser)
                }
            }

            const auth = () => {
                if(user.name.localeCompare('') === 0 && user.pass.localeCompare('') === 0) return

                if(!userFromStorage){
                    user.pass = new hash.SHA1().b64(user.pass)
                }

                asyncRequest(api.MODEL_REQUESTS.auth, JSON.stringify(user))
                    .then(value => {
                        if (value.responseCode === 200) {
                            const user = value.data.findings[0]
                            setUser(storages.session, JSON.stringify(user))
                            const u = user
                            delete u.role
                            console.log(u)
                            setUser(storages.local, JSON.stringify(u))

                            context.emit('successful', value.data)
                        }
                    })
            }

            const clear = () => {
                user.name = ''
                user.pass = ''
            }

            checkUser()

            return {
                auth,
                clear,
                user,
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "./src/assets/style/auth";
</style>
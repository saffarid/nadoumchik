<template>
    <div class="auth-screen">
        <div class="auth-form">
            <div class="header-auth">
                <Logo :x="0" :y="0" :height="50" :width="50"/>
                <TextLabel label="НАДОУМЧИК"/>
            </div>
            <div class="form">
                <TextField
                        v-model="user.name"
                        :type="'text'"
                        :placeholder="'Имя пользователя'"
                />
                <TextField
                        v-model="user.pass"
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
    import {asyncRequest} from "@/js/web";
    const hash = require('jshashes')

    export default {
        name: "Auth",
        components: {
            Button,
            Logo,
            TextField,
            TextLabel
        },
        emit:['successful'],
        setup(props, context) {
            const api = inject('$api')
            const user = reactive({
                name: '',
                pass: ''
            })

            const auth = () => {
                console.log(api.MODEL_REQUESTS.auth)
                asyncRequest(api.MODEL_REQUESTS.auth, JSON.stringify({
                    name: user.name,
                    // pass: new hash.SHA1().b64(user.pass)
                    pass: user.pass
                }))
                .then(value => {
                    if(value.responseCode === 200){
                        context.emit('successful', value.data)
                    }
                })
            }

            const clear = () => {
                user.name = ''
                user.pass = ''
            }

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
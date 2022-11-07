<template>
    <Studio v-if="user !== null"
            class="light dimension site"
            :style="styleVars"/>
    <Auth v-else
          @successful="login"
          class="light dimension site"
          :style="styleVars"/>
</template>

<script>

    import Studio from "./components/Studio";
    import Auth   from "@/components/commons/Auth";
    import {
        ref,
        provide,
        reactive
    }             from 'vue'

    export default {
        name: 'App',
        components: {
            Auth,
            Studio
        },
        setup() {
            const user = ref(null)
            provide('user', user)

            const styleVars = reactive({
                '--height_per': window.innerHeight * 0.01 + 'px'
            })
            window.addEventListener('resize', () => {
                styleVars['--height_per'] = window.innerHeight * 0.01 + 'px'
            })

            const login = value => {
                user.value = value
            }

            return {
                login,
                user,
                styleVars
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/style/main";
</style>

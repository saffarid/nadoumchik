<template>
    <Studio v-if="user !== null"
            class="light dimension site"/>
    <Auth v-else
          @successful="login"
          class="light dimension site"
    />
</template>

<script>

    import Studio from "@/components/cabinet/Studio";
    import Auth   from "@/components/commons/Auth";
    import {
        ref,
    }             from 'vue'

    export default {
        name: 'App',
        components: {
            Auth,
            Studio
        },
        setup() {
            const user = ref(null)

            const login = value => {
                user.value = value
            }

            return {
                login,
                user
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/style/main";
</style>

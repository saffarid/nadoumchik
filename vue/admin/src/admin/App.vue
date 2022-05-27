<template>
    <Studio v-if="role !== null"
            class="light dimension site"/>
    <Auth v-else
          @successful="login"
          class="light dimension site"
    />
</template>

<script>

    import Studio from "@/components/admin/Studio";
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
            const role = ref(null)

            const login = value => {
                console.log(value)
                role.value = value
            }

            return {
                login,
                role
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/style/main";
</style>

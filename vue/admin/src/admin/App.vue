<template>
    <Studio v-if="isAuth"
            class="light dimension site"/>
    <Auth v-else
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
            const isAuth = ref(false)

            return {
                isAuth
            }
        }
    }
</script>

<style lang="scss">
    @import "../assets/style/main";
</style>

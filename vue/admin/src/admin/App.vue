<template>
    <Studio v-if="true"
            class="light dimension site"/>
    <Auth v-else
          class="light dimension site"/>
</template>

<script>
    import Studio from "@/components/admin/Studio";
    import Auth   from "@/components/commons/Auth";

    export default {
        name: 'App',
        components: {
            Auth,
            Studio
        },
    }
</script>

<style lang="scss">
    @import "../assets/style/main";
</style>

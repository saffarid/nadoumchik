<template>
    <div v-if="isLoading">
        <TextLabel :label="`Добро пожаловать ${user.personal.nickname}`"/>
    </div>
    <PageLoading v-else/>
</template>

<script>
    import {
        Card,
        PageLoading,
        TextLabel,
    }                     from "saffarid-ui-kit"
    import {
        ref,
        inject
    }                     from 'vue'

    export default {
        name: "Main",
        components: {
            // Card,
            PageLoading,
            TextLabel,
        },
        setup() {
            const api = inject('$api')
            const user = inject('user')
            const isLoading = ref(true)

            return {
                isLoading,
                user
            }
        }
    }
</script>

<style scoped>

</style>
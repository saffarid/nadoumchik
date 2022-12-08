<template>
    <div v-if="isLoading">
        <span>{{`Добро пожаловать ${user.personal.s_name} ${user.personal.f_name}`}}</span>
    </div>
    <Loading v-else/>
</template>

<script>
    import {
        Loading,
    } from "saffarid-ui-kit"
    import {
        ref,
        inject
    } from 'vue'

    export default {
        name: "Main",
        components: {
            Loading,
        },
        setup() {
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
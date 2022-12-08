<template>
    <Studio v-if="user != null"
            class="light dimension site"
            :style="styleVars"/>
    <Auth v-else
          class="light dimension site"
          :style="styleVars"/>
</template>

<script>
    import {useStore} from 'vuex'
    import Studio     from "./components/Studio";
    import Auth       from "@/components/commons/Auth";
    import {
        computed,
        provide,
        reactive
    }                 from 'vue'

    export default {
        name: 'App',
        components: {
            Auth,
            Studio
        },
        setup() {
            const store = useStore()
            const user = computed(() => store.getters.user)

            const styleVars = reactive({
                '--height_per': window.innerHeight * 0.01 + 'px'
            })
            window.addEventListener('resize', () => {
                styleVars['--height_per'] = window.innerHeight * 0.01 + 'px'
            })

            return {
                user,
                styleVars
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/style/main";
</style>

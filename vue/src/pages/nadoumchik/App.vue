<template>
    <Nadoumchik
            class="light dimension site"
            :style="styleVars"
    />
</template>

<script>
    import Nadoumchik from "@/pages/nadoumchik/components/Nadoumchik";
    import {
        reactive
    }                 from 'vue'
    import {useStore} from 'vuex'

    export default {
        name: 'App',
        components: {
            Nadoumchik
        },
        setup() {
            const store = useStore()
            store.dispatch('nadoumchikInit')

            const styleVars = reactive({
                '--height_per': window.innerHeight * 0.01 + 'px'
            })

            window.addEventListener('resize', () => {
                styleVars['--height_per'] = window.innerHeight * 0.01 + 'px'
            })

            return {
                styleVars
            }
        }
    }
</script>

<style lang="scss">
    @import "../../assets/style/main";
</style>

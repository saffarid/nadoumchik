<template>
    <Nadoumchik
            class="light dimension site"
            :style="styleVars"/>
</template>

<script>

    import Nadoumchik from "@/nadoumchik/components/Nadoumchik";
    import {
        reactive
    }                 from 'vue'

    export default {
        name: 'App',
        components: {
            Nadoumchik
        },
        setup() {
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
    @import "../assets/style/main";
</style>

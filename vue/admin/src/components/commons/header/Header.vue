<template>
    <component :is="c"/>
</template>

<script>
    import {
        defineAsyncComponent,
        ref
    } from 'vue'

    export default {
        name: "Header",
        props: {
            type: {
                type: String,
                required: true
            }
        },
        setup(props) {
            const c = ref(null)

            c.value = defineAsyncComponent(() => import(`./${props.type}.vue`))

            return {c}
        }
    }
</script>

<style lang="scss">
    .w_bgr {
        background-color: var(--background);
        width: calc(100vw - 10px);
        padding: 5px;
        position: sticky;
        top: 0px;
        z-index: 50;
    }

    .top-header {
        height: 65px;
        display: flex;
        background-color: var(--primary_color);
        border-radius: 5px;
        align-items: center;
        align-content: center;
        align-self: stretch;
        column-gap: 5px;

        .logo {
            display: flex;
            align-items: center;

            h1 {
                margin: 0;
                font-size: 25px;
                font-weight: normal;
                letter-spacing: .025em;
            }
        }
    }
</style>
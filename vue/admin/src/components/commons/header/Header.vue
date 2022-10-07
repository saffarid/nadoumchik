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
        setup(props){
            const c = ref(null)

            c.value = defineAsyncComponent(() => import(`./${props.type}.vue`))

            return {c}
        }
    }
</script>
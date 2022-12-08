<template>
    <component :is="comp" :list="l"/>
</template>

<script>

    import {
        defineAsyncComponent, reactive, watch
    } from 'vue'

    export default {
        name: "List",
        props: {
            type: {
                type: String,
                required: true
            },
            list: {
                type: Object,
                required: true
            },
            d: {
                type: String,
                required: false,
                default: 'publ'
            }
        },
        setup(props) {

            const comp = defineAsyncComponent({
                delay: 100,
                timeout: 60000,
                loader: () => import(`./${props.type}.vue`),
            })

            const l = reactive([])

            watch(props, () => {
                l.length = 0
                for (const v of Object.values(props.list)) {
                    l.push(v)
                }
                l.sort( (p1, p2) => new Date(p2.dateStamp).getTime() - new Date(p1.dateStamp).getTime() )
            })

            return {
                comp,
                l
            }

        }
    }
</script>
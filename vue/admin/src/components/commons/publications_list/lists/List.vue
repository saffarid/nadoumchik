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
                console.log(['list', props.list])
                l.length = 0
                for (const v of Object.values(props.list)) {
                    l.push(v)
                }

                // l.sort((a, b) => new Date(a.dateStamp).getMilliseconds() - (new Date(b.dateStamp)).getMilliseconds())
            })


            return {
                comp,
                l
            }

        }
    }
</script>

<style scoped>

</style>
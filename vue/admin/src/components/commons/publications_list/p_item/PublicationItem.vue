<template>
    <component :is="c" :data="data"/>
</template>

<script>
    import {
        defineAsyncComponent,
        ref
    } from 'vue'


    export default {
        name: "PublicationItem",
        props: {
            /**
             * Вариант отображения публикации в списке.
             * Выбирается в соответствие с списком p_item_types
             * @see p_item_types
             * */
            type: {
                type: String,
                required: true
            },
            /**
             * Информация, передающаяся конкретному компоненту.
             * Набор информации определяется непосредственно компонентом.
             * */
            data: {
                type: Object,
                required: true
            }
        },
        setup(props) {
            const c = ref(null)

            console.log(['item', props.data])

            c.value = defineAsyncComponent(() => import(`./${props.type}.vue`))

            return {c}
        }
    }
</script>

<template>
    <div class="simple">
        <PublicationItem v-for="(p, index) in list"
                         :key="index"
                         :type="p_item_types.editable"
                         :data="{
                             publication: p
                         }"
                         @edit="$emit('edit', p)"
                         @remove="$emit('remove', p)"
                         @read="$emit('read', p)"
        />
    </div>
</template>

<script>
    import PublicationItem from "@/components/commons/publications_list/p_item/PublicationItem";
    import {
        reactive,
        watch
    }                      from 'vue'
    import {
        p_item_types
    }                      from "@/components/commons/publications_list/p_item/p_item_types";


    export default {
        name: "L_Simple",
        components: {
            PublicationItem
        },
        props: {
            list: {
                type: Array,
                required: true
            }
        },
        setup() {

            // const l = reactive([])
            //
            // watch(props, () => {
            //     l.length = 0
            //     for (const v of Object.values(props.list)) {
            //         l.push(v)
            //     }
            //     l.sort((a, b) => {
            //             return new Date(a.dateStamp).getMilliseconds() - (new Date(b.dateStamp)).getMilliseconds()
            //         }
            //     )
            // })

            return {
                // l
                p_item_types
            }

        }
    }
</script>

<style lang="scss" scoped>
    .simple {
        display: grid;
        grid-template-rows: repeat(auto-fit, var(--publication_item_h));
        row-gap: 2px;
        width: 100%;
        padding-top: 2px;
    }
</style>
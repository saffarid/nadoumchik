<template>
    <div class="simple">
        <PublicationItem v-for="(publication, index) in list"
                         :key="index" :publication="publication"
                         @edit="$emit('edit', publication)"
                         @remove="$emit('remove', publication)"
                         :can-edit="true"
        />
    </div>
</template>

<script>
    import PublicationItem from "@/components/commons/publications_list/PublicationItem";
    import {
        reactive,
        watch
    }                      from 'vue'

    export default {
        name: "Simple",
        components: {
            PublicationItem
        },
        props: {
            list: {
                type: Array,
                required: true
            }
        },
        // setup(props) {

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
            //
            // return {
            //     l
            // }

        // }
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
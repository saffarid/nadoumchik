<template>
    <div class="zigzag">
        <PublicationItem v-for="(publication, index) in list"
                         :key="index" :publication="publication"
                         :class="{'item-on-left':(index % 2), 'item-on-right':!(index % 2)}"
                         :can-edit="false"
                         :on-left="index % 2"
                         @click="$emit('read', publication)"
        />
    </div>
</template>

<script>
    import PublicationItem   from "@/components/commons/publications_list/PublicationItem";
    import {reactive, watch} from "vue";


    export default {
        name: "ZigZag",
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
        //
        //     const l = reactive([])
        //
        //     watch(props, () => {
        //         l.length = 0
        //         for (const v of Object.values(props.list)) {
        //             l.push(v)
        //         }
        //         l.sort((a, b) => {
        //                 return new Date(a.dateStamp).getMilliseconds() - (new Date(b.dateStamp)).getMilliseconds()
        //             }
        //         )
        //     })
        //
        //     return {
        //         l
        //     }
        //
        // }
    }
</script>

<style lang="scss" scoped>
    .item-on-left {
        justify-self: start;
    }

    .item-on-right {
        justify-self: end;
    }

    .zigzag {
        display: grid;
        grid-template-rows: repeat(auto-fit, var(--publication_item_h));
        width: 790px;
        padding-top: 5px;
    }
</style>
<template>
    <div class="zigzag">
        <PublicationItem v-for="(p, index) in list"
                         :key="index"
                         :type="p_item_types.listed"
                         :data="{
                             publication: p,
                             onLeft: (isLess600 || index % 2 != 0)
                         }"
                         :class="{'item-on-left':(index % 2), 'item-on-right':!(index % 2)}"
                         @read="$emit('read', p)"
        />
    </div>
</template>

<script>
    import PublicationItem   from "@/components/commons/publications_list/p_item/PublicationItem";
    import {ref} from "vue";
    import {p_item_types}    from "@/components/commons/publications_list/p_item/p_item_types";

    export default {
        name: "L_ZigZag",
        components: {
            PublicationItem
        },
        props: {
            list: {
                type: Array,
                required: true
            }
        },
        setup( ) {
            const isLess600 = ref(window.innerWidth < 600)

            window.addEventListener('resize', () => {
                isLess600.value = window.innerWidth < 600
            })

            return {
                isLess600,
                p_item_types
            }

        }
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
        width: 100%;
        max-width: 790px;
        padding-top: 5px;

        justify-self: center;

        .p-item {
            width: calc(100% - var(--publication_item_h));
        }
    }

    @media (max-width: 600px) {
        .item-on-right {
            justify-self: start;
        }

        .zigzag .p-item {
            width: 100%;
        }
    }
</style>
<template>
    <div class="new_ps">
        <PublicationItem v-for="(p, index) in list"
                         :key="index"
                         :type="p_item_types.new"
                         :data="{
                             publication: p
                         }"
                         @read="$emit('read', p)"
        />
    </div>
</template>

<script>
    import PublicationItem from "@/components/commons/publications_list/p_item/PublicationItem";
    import {p_item_types}  from "@/components/commons/publications_list/p_item/p_item_types";

    export default {
        name: "L_New",
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
            return {
                p_item_types
            }
        }
    }
</script>

<style lang="scss" scoped>

    .new_ps {
        display: grid;
        grid-template-columns: repeat(4, minmax(200px, 1fr));
        gap: 5px;
        justify-content: stretch;
    }

    @media (max-width: 1350px) {
        .new_ps {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
    }

    @media (max-width: 835px) {
        .new_ps {
            grid-template-columns: repeat(2, minmax(200px, 1fr));
        }
    }

    @media (max-width: 600px) {
        .new_ps {
            grid-template-columns: repeat(1, 1fr);
        }
    }

</style>
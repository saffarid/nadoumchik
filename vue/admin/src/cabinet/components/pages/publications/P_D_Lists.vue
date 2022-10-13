<template>
    <List
            class="list"
            @edit="edit"
            @remove="remove"
            :type="list_types.simple"
            :list="list"/>

    <PageLoading v-if="isLoading && Object.keys(list).length == 0"/>
    <NotFound
            v-if="(Object.keys(list).length == 0 && !thereIsMore) && !isLoading"/>
</template>

<script>
    import {list_types}  from '@/components/commons/publications_list/lists/list_types'
    import {watch}       from 'vue'
    import {PageLoading} from 'saffarid-ui-kit'
    import NotFound      from "@/components/commons/NotFound";
    import List          from "@/components/commons/publications_list/lists/List";


    export default {
        name: "P_D_Lists",
        components: {

            List,
            PageLoading,
            NotFound
        },
        props: {
            edit: {
                type: Function,
                required: true
            },
            remove: {
                type: Function,
                required: true
            },
            list: {
                type: Object,
                required: true
            },
            isLoading: {
                type: Boolean,
                required: true,
            },
            thereIsMore: {
                type: Boolean,
                required: false,
                default: true
            },
        },
        setup() {
            return {
                list_types
            }
        }
    }
</script>

<style lang="scss" scoped>

    .list {
        margin: 2px 0 5px 0;
        max-height: calc(var(--workspace_h) - var(--tab_h) - var(--toolbar_h) - 10px);
        overflow-y: auto;
    }

</style>

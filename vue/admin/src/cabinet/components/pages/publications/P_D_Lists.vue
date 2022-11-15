<template>
    <List class="list"
          @edit="edit"
          @remove="remove"
          :type="list_types.simple"
          :list="state.list"
          :d="d"
    />

    <Loading v-if="state.isLoading || !state.isReady"/>

    <NotFound
            v-if="state.isReady && Object.keys(state.list).length == 0 && !state.thereIsMore && !state.isLoading"/>
</template>

<script>
    import {list_types} from '@/components/commons/publications_list/lists/list_types'
    import {Loading}    from 'saffarid-ui-kit'
    import NotFound     from "@/components/commons/NotFound";
    import List         from "@/components/commons/publications_list/lists/List";

    export default {
        name: "P_D_Lists",
        components: {
            List,
            Loading,
            NotFound
        },
        props: {
            d: {
                type: String,
                required: false,
                default: 'publ'
            },
            edit: {
                type: Function,
                required: true
            },
            remove: {
                type: Function,
                required: true
            },
            state: {
                type: Object,
                required: true
            }
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

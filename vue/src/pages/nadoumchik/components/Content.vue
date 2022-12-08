<template>
    <div class="content-container">

        <div class="new-content">
            <List :type="list_types.new"
                  :list="newP"
                  @read="showPublication"
            />
        </div>
        <div class="other-content">
            <List :type="list_types.zigzag"
                  :list="oldP"
                  @read="showPublication"
            />
        </div>

    </div>

    <PublicationView
            v-if="showedPublication != null"
            :publication="showedPublication"
            @close="showedPublication = null"
    />

</template>

<script>
    import List                      from "@/components/commons/publications_list/lists/List";
    import {list_types}              from "@/components/commons/publications_list/lists/list_types";
    import {computed, ref, reactive} from "vue";
    import PublicationView           from "@/components/commons/publications/PublicationView";
    import Loader                    from "@/components/Loader";
    import {useStore}                from 'vuex'

    export default {
        name: "Content",
        components: {
            Loader,
            List,
            PublicationView
        },
        setup() {
            const showedPublication = ref(null)
            const store = useStore()

            const newP = computed(() => store.getters.newPublications)
            const oldP = computed(() => store.getters.otherPublications)

            const showPublication = (publication) => {
                showedPublication.value = publication
            }

            return {
                newP,
                oldP,
                list_types,
                showPublication,
                showedPublication,
            }
        }
    }
</script>

<style lang="scss" scoped>

    .content-container {
        background-color: var(--primary_color);
        border-radius: 10px;
        padding: 5px;
        width: 1330px;

        .new-content {
            display: grid;
            align-self: stretch;
            justify-self: stretch;
            align-content: center;
        }

        .other-content {
            display: grid;
            align-self: stretch;
            justify-self: stretch;
            align-content: center;
            justify-content: stretch;
        }
    }

    @media (max-width: 1350px) {
        .content-container {
            width: calc(100vw - 20px);
            margin: 0 5px;
        }
    }

</style>
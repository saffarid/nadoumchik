<template>
    <div v-if="isLoading"
         class="system-settings">
        <TitlePane class="ads" title="Рекламные блоки">
            <Row>
                <span>Показ рекламы</span>
                <Toggle
                        id="isShowAds"
                        v-model="systemData.ads.isShowingAds"
                        :true-value="true"
                        :false-value="false"
                />
            </Row>
        </TitlePane>
    </div>
    <Loading v-else/>
</template>

<script>
    import {
        TitlePane,
        Loading,
        Toggle
    }                     from "saffarid-ui-kit"
    import Row            from "@/components/commons/Row";
    import {
        computed,
        ref,
        watch
    }                     from 'vue'
    import {useStore}     from 'vuex'
    import {asyncRequest} from "@/js/web";

    export default {
        name: "System",
        components: {
            TitlePane,
            Loading,
            Row,
            Toggle
        },
        setup() {
            const store = useStore()
            const systemData = computed(() => store.getters.system)
            const isLoading = ref(false)

            watch(systemData, () => store.dispatch('updateSystemData', systemData))

            return {
                isLoading,
                systemData,
            }
        }
    }
</script>

<style lang="scss">
    .system-settings {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(1fr, 500px));

        .ads {
            width: max-content;
        }
    }
</style>
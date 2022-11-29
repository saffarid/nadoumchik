<template>
    <div class="system-settings">
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
</template>

<script>
    import {
        TitlePane,
        Loading,
        Toggle
    }          from "saffarid-ui-kit"
    import Row from "@/components/commons/Row";
    import {
        inject,
        reactive,
        onActivated,
        onBeforeUnmount,
        onDeactivated,
    }          from 'vue'
    import {useStore}     from 'vuex'

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
            const systemData = reactive({})
            const workObject = inject('workObject')

            onBeforeUnmount(() => {
                workObject.objectCopy(store.getters.system, systemData)
            })
            onActivated(() => {
                workObject.objectCopy(store.getters.system, systemData)
            })
            onDeactivated(() => {

            })

            return {
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
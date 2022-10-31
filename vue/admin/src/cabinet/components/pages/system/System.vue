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
        ref,
        reactive,
        inject,
        watch
    }                     from 'vue'
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
            const workObject = inject('workObject')
            const api = inject('$api')
            const systemData = reactive({})
            const isLoading = ref(false)

            const systemSelect = () =>
                asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.system.name, api.ESSENCE.system.actions.get), JSON.stringify({}))
                    .then(data => {
                        workObject.objectCopy(data.datas.findings[0], systemData)
                        isLoading.value = true
                    })
                    .catch(err => console.log(err))

            const showAds = (value) => {
                // systemData.value.ads.isShowingAds = value
                // asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.update), JSON.stringify(systemData.value))
                //     .then(() => systemSelect())
                //     .catch(err => {
                //         console.error(err)
                //     })
            }

            watch(systemData, () => {
                asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.system.name, api.ESSENCE.system.actions.edit), JSON.stringify(systemData))
                    .catch(err => {
                        console.error(err)
                    })
            })

            systemSelect()

            return {
                isLoading,
                systemData,
                showAds
            }
        }
    }
</script>

<style lang="scss" scoped>
    .system-settings {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(1fr, 500px));

        .ads {
            width: max-content;
        }
    }
</style>
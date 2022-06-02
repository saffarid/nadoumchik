<template>
    <div v-if="isLoading">
        <Card title="Рекламные блоки">
            <Row>
                <TextLabel label="Показ рекламы"/>
                <Toggle
                        id="isShowAds"
                        :modelValue="systemData.ads.isShowingAds"
                        @update:modelValue="showAds"
                        :true-value="true"
                        :false-value="false"
                />
            </Row>
        </Card>
    </div>
    <PageLoading v-else/>
</template>

<script>
    import {
        Card,
        PageLoading,
        TextLabel,
        Toggle
    }                     from "saffarid-ui-kit"
    import Row            from "@/components/commons/Row";
    import {
        ref,
        inject
    }                     from 'vue'
    import {asyncRequest} from "@/js/web";

    export default {
        name: "Main",
        components: {
            Card,
            PageLoading,
            Row,
            TextLabel,
            Toggle
        },
        setup() {
            const api = inject('$api')
            const systemData = ref(null)
            const isLoading = ref(false)

            const systemSelect = () => asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.select), JSON.stringify({}))
                .then(data => {
                    systemData.value = data.datas.findings[0]
                    isLoading.value = true
                })
                .catch(err => console.log(err))

            const showAds = (value) => {
                systemData.value.ads.isShowingAds = value
                asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.update), JSON.stringify(systemData.value))
                    .then(() => systemSelect())
                    .catch(err => {
                        console.error(err)
                    })
            }

            systemSelect()

            return {
                isLoading,
                systemData,
                showAds
            }
        }
    }
</script>

<style scoped>

</style>
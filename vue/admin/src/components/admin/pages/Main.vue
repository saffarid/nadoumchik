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
            const systemData = ref(null)
            const isLoading = ref(false)

            const systemSelect = () => asyncRequest('/system/select', JSON.stringify({}))
                .then(data => {
                    systemData.value = data
                })
                .catch(err => console.log(err))

            const showAds = (value) => {
                systemData.value.ads.isShowingAds = value
                asyncRequest('/system/update', JSON.stringify(systemData.value))
                    .then(() => systemSelect())
                    .catch(err => {
                        console.error(err)
                    })
            }

            systemSelect()

            isLoading.value = true
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
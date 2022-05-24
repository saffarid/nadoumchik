<template>
    <div v-if="isLoading">
        <Card title="Рекламные блоки">
            <Row>
                <TextLabel label="Показ рекламы"/>
                <Toggle
                        id="isShowAds"
                        :modelValue="system.ads.isShowingAds"
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
    } from "saffarid-ui-kit"

    import Row            from "@/components/commons/Row";
    import {
        inject,
        ref,
    }                     from 'vue'
    // import {asyncRequest} from "@/js/web";

    export default {
        name: "Main",
        components: {
            Card,
            PageLoading,
            Row,
            TextLabel,
            Toggle
        },
        setup(){
            const isLoading = ref(false)
            const system = inject('system')
            // const systemSelect = inject('systemSelect')

            // const showAds = () => {
            //     asyncRequest('/system/update', system.value)
            //     .then(() => systemSelect())
            //     .catch(err => {console.error(err)})
            // }

            isLoading.value = true
            return {
                isLoading,
                system,
                // showAds
            }
        }
    }
</script>

<style scoped>

</style>
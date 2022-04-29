<template>
    <div>
        <BorderPane class="list-of-publications">
            <template v-slot:top>
                <BorderPane class="tool-bar">
                    <template v-slot:left>
                        <TextLabel label="ПУБЛИКАЦИИ"/>
                    </template>
                    <template v-slot:right>
                        <Button class="image-button">
                            <plus height="16" width="16"/>
                        </Button>
                    </template>
                </BorderPane>
            </template>
            <template v-slot:center>
                <div v-if="isReady">
                    <PublicationItem v-for="(publication, index) in articles" :key="index" :publication="publication" :imgOnLeft="true" :textIsDark="true"/>
                    <Button text="Загрузить ещё" @click="loadPublications"/>
                </div>
                <div v-else>
                    Загрузка...
                </div>
            </template>
        </BorderPane>
    </div>
</template>

<script>
    import {
        ref,
        // reactive
    } from 'vue'
    import {asyncRequest} from "@/js/web";

    import {
        Button,
        BorderPane,
        TextLabel
    } from 'saffarid-ui-kit'
    import PublicationItem from "@/components/pages/publications/PublicationItem";
    import Plus from "@/assets/img/plus";

    export default {
        name: "Publications",
        components: {
            Button,
            Plus,
            PublicationItem,
            BorderPane,
            TextLabel,
        },
        setup() {
            const isReady = ref(false)
            const articles = ref([])
            let countLoadPublications = ref(10)

            const loadPublications = () => {
                asyncRequest('/articles/select', JSON.stringify({
                        shift: articles.value.length,
                        count: countLoadPublications.value
                    })
                )
                    .then(data => {
                        setTimeout(() => {
                            articles.value = articles.value.concat(data.articles)
                            console.log(data)
                            isReady.value = true
                        }, 300)

                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            loadPublications()

            return {
                articles,
                isReady,
                loadPublications,
                countLoadPublications
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
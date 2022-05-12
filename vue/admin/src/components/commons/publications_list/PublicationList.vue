<template>
    <div>
        <div class="list" v-if="isReady">
            <PublicationItem v-for="(publication, index) in articles"
                             :key="index" :publication="publication"
                             @edit="$emit('edit', publication)"
                             @remove="$emit('remove', publication)"
                             @click="$emit('read', publication )"
                             :can-edit="canEditPublications"
            />
            <PageLoading v-if="isLoading"/>
            <Button
                    v-if="!isLoading && thereIsMore"
                    class="text-button"
                    text="Загрузить ещё"
                    @click="loadPublications(articles.length, countLoadPublications)"/>
        </div>
        <div v-else>
            Загрузка...
        </div>
    </div>
</template>

<script>
    import {
        reactive,
        ref,
        // watch
    } from 'vue'
    import {asyncRequest} from "@/js/web";

    import {
        Button,
        PageLoading
    } from 'saffarid-ui-kit'
    import PublicationItem from "@/components/commons/publications_list/PublicationItem";

    export default {
        name: "PublicationList",
        components: {
            Button,
            PublicationItem,
            PageLoading
        },
        props: {
            canEditPublications: {
                type: Boolean,
                required: false,
                default: false
            }
        },
        setup() {
            const editPublicationShow = ref(false)
            /**
             * Флаг готовности отображать считанные публикации
             * */
            const isReady = ref(false)
            /**
             * Флаг окончания загрузкиновых публикаций
             * */
            const isLoading = ref(false)
            /**
             * Флаг считвания всех публикаций с сервера
             * */
            const thereIsMore = ref(false)
            /**
             * Массив публикацй
             * */
            const articles = ref([])
            /**
             * Кол-во загружаемых публикаций
             * */
            const countLoadPublications = ref(10)

            const response = reactive({
                code: -1,
                message: 'empty'
            })

            /**
             * Функция отправляет запрос на получение новой порции публикаций,
             * если запрос проходит удачно, публикации добавляются в список для отображения
             * */
            const loadPublications = (shift, count, resolve) => {
                if (resolve === undefined) {
                    resolve = data => {
                        setTimeout(() => {
                            if(shift === 0){
                                articles.value = data.articles
                            } else {
                                articles.value = articles.value.concat(data.articles)
                            }
                            thereIsMore.value = data.thereIsMore
                            isReady.value = true
                            isLoading.value = false
                        }, 300)
                    }
                }
                isLoading.value = true
                asyncRequest('/articles/select', JSON.stringify({
                        shift: shift,
                        count: count
                    })
                )
                    .then(resolve)
                    .catch(err => {
                        console.log(err)
                    })
            }
            loadPublications(
                articles.value.length,
                countLoadPublications.value)

            const refreshList = (append) => {
                loadPublications(0, articles.value.length + append)
            }

            return {
                response,
                articles,
                isReady,
                isLoading,
                thereIsMore,
                loadPublications,
                countLoadPublications,
                editPublicationShow,
                refreshList
            }
        }
    }
</script>
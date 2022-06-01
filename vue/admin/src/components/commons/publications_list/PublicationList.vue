<template>
<!--    <div>-->
        <div
                class="list"
                :class="{'gap':hasRowGap}"
                v-if="isReady">
            <PublicationItem v-for="(publication, index) in articles"
                             :key="index" :publication="publication"
                             :class="{'item-on-left':(publication.preview.imgOnLeft || !figure), 'item-on-right':(!publication.preview.imgOnLeft && figure)}"
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
<!--    </div>-->
</template>

<script>
    import {
        inject,
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
            },
            hasRowGap:{
                type: Boolean,
                required: false,
                default: false
            },
            figure:{
                type: Boolean,
                required: false,
                default: false
            }
        },
        setup() {
            const api = inject('$api')
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
                                articles.value = data.datas.findings
                            } else {
                                articles.value = articles.value.concat(data.datas.findings)
                            }
                            thereIsMore.value = data.thereIsMore
                            isReady.value = true
                            isLoading.value = false
                        }, 300)
                    }
                }
                isLoading.value = true
                asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.publications.name, api.ACTS.select), JSON.stringify({
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
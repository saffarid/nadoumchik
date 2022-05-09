<template>
    <div style="display:grid; justify-self: center; justify-items: center">
        <div class="list" v-if="isReady">
            <PublicationItem v-for="(publication, index) in articles"
                             :key="index" :publication="publication"
                             @edit="$emit('edit', publication)"
                             @remove="$emit('remove', publication)"
                             @click="$emit('read', publication )"
                             :can-edit="canEditPublications"
            />
            <Button text="Загрузить ещё" @click="loadPublications(articles.length, countLoadPublications)"/>
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
    } from 'vue'
    import {asyncRequest} from "@/js/web";

    import {
        Button,
    } from 'saffarid-ui-kit'
    import PublicationItem from "@/components/commons/publications_list/PublicationItem";

    export default {
        name: "PublicationList",
        components: {
            Button,
            PublicationItem,
        },
        props:{
          canEditPublications:{
              type: Boolean,
              required: false,
              default: false
          }
        },
        setup() {
            const editPublicationShow = ref(false)
            const isReady = ref(false)
            const articles = ref([])
            let countLoadPublications = ref(10)

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
                            articles.value = articles.value.concat(data.articles)
                            isReady.value = true
                        }, 300)
                    }
                }
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


            return {
                response,
                articles,
                isReady,
                loadPublications,
                countLoadPublications,
                editPublicationShow,
            }
        }
    }
</script>
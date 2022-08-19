<template>
    <div>
        <BorderPane class="n">
            <template v-slot:top>
                <Header/>
            </template>
            <template v-slot:left v-if="isReady">
                <div class="ads" v-if="system.ads.isShowingAds">
                    <img src="https://i01.fotocdn.net/s111/260ae80cce6d159a/public_pin_m/2488908908.jpg" height="300"
                         width="200"/>
                </div>
            </template>
            <template v-slot:center>

                <BorderPane>
                    <template v-slot:top>
                        <div class="tool-bar">
                            <Row style="column-gap: 5px">
                                <TextLabel label="Загружать по"/>
                                <AmountUpload :amount="amountLoad"/>
                            </Row>
                        </div>
                    </template>
                    <template v-slot:center>
                        <div>
                            <List
                                    :type="lists.zigzag"
                                    :list="publList"
                                    @read="showPublication"
                            />

                            <PageLoading v-if="isLoading"/>
                            <NotFound v-if="(Object.keys(publList).length == 0 && !thereIsMore) && !isLoading"/>
                        </div>
                    </template>
                    <template v-slot:bottom>
                        <Button
                                v-if="!isLoading && thereIsMore"
                                class="text-button"
                                text="Загрузить ещё"
                                @click="loadPublications(Object.keys(publList).length, amountLoad)"/>
                    </template>
                </BorderPane>

            </template>
            <template v-slot:right v-if="isReady">
                <div class="ads" v-if="system.ads.isShowingAds">
                    <img src="https://i01.fotocdn.net/s111/260ae80cce6d159a/public_pin_m/2488908908.jpg" height="300"
                         width="200"/>
                </div>
            </template>
        </BorderPane>
        <PublicationView
                v-if="showedPublication != null"
                :publication="showedPublication"
                @close="showedPublication = null"
        />
    </div>
</template>

<script>
    import Header          from "@/components/commons/Header";
    import {
        provide,
        ref,
        inject,
        reactive
    }                      from "vue";
    import {
        BorderPane,
        PageLoading,
        TextLabel
    }                      from 'saffarid-ui-kit'
    import AmountUpload    from "@/components/commons/publications_list/AmountUpload";
    import PublicationView from "@/components/commons/publications/PublicationView";
    import List            from "@/components/commons/publications_list/lists/List";
    import NotFound        from "@/components/commons/NotFound";
    import Row             from "@/components/commons/Row";
    import {asyncRequest}  from "@/js/web";
    import {_lists}        from '@/components/commons/publications_list/lists/list_types'

    export default {
        name: "Nadoumchik",
        components: {
            AmountUpload,
            PublicationView,
            BorderPane,
            Header,
            NotFound,
            List,
            PageLoading,
            Row,
            TextLabel
        },
        setup() {
            const api = inject('$api')

            const showedPublication = ref(null)
            const system = reactive({})

            const workObject = inject('workObject')

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
            const publList = reactive({})
            /**
             * Кол-во загружаемых публикаций
             * */
            const amountLoad = ref(10)

            const lists = _lists

            asyncRequest(api.MODEL_REQUESTS.work_e(api.ESSENCE.system.name, api.ESSENCE.system.actions.get), JSON.stringify({}))
                .then(data => {
                    workObject.objectCopy(data.datas.findings[0], system)
                    provide('system', system)
                    isReady.value = true
                })
                .catch(err => console.log(err))

            const showPublication = (publication) => {
                showedPublication.value = publication
            }

            /**
             * Функция отправляет запрос на получение новой порции публикаций,
             * если запрос проходит удачно, публикации добавляются в список для отображения
             * */
            const loadPublications = (shift, count, resolve) => {
                if (resolve == undefined) {
                    resolve = data => {
                        setTimeout(() => {
                            if (data.responseCode == api.CODES_RESPONSE.ok.responseCode) {
                                if (shift == 0) {
                                    for (const key of Object.keys(publList)) {
                                        delete publList[key]
                                    }
                                }

                                for (const obj of data.datas.findings) {
                                    publList[obj._id] = obj
                                }

                                thereIsMore.value = data.thereIsMore
                            }
                            isReady.value = true
                            isLoading.value = false
                        }, 300)
                    }
                }

                isLoading.value = true

                const samplingTerm = {
                    shift: shift,
                    count: count,
                }

                const urlRequest = api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.findSample)

                asyncRequest(urlRequest, JSON.stringify(samplingTerm))
                    .then(resolve)
                    .catch(err => console.log(err))
            }

            loadPublications(
                Object.keys(publList).length,
                amountLoad.value)

            return {
                showPublication,
                showedPublication,
                system,
                isReady,
                lists,
                loadPublications,
                publList,
                thereIsMore,
                isLoading,
                amountLoad
            }
        }
    }
</script>

<style lang="scss" scoped>

    .ads {
        padding-top: 10px;
    }

    .list-of-publications {

        justify-self: center;
        justify-content: center;
        max-height: 85vh;
        overflow-y: auto;

        padding-left: 10px;
        padding-right: 10px;


        .list {
            overflow-y: hidden;
            max-height: max-content;
            row-gap: 10px;
        }

    }


</style>
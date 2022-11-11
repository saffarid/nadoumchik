<template>
    <div class="content-container">

        <div class="new-content">
            <List :type="list_types.new"
                  :list="newP"
                  @read="showPublication"
            />
        </div>
        <div class="other-content">
<!--            <List :type="list_types.zigzag"-->
<!--                  :list="publList.otherP"-->
<!--                  @read="showPublication"-->
<!--            />-->
        </div>

    </div>

    <PublicationView
            v-if="showedPublication != null"
            :publication="showedPublication"
            @close="showedPublication = null"
    />

</template>

<script>
    import List                                              from "@/components/commons/publications_list/lists/List";
    import {list_types}                                      from "@/components/commons/publications_list/lists/list_types";
    import {computed, inject, provide, reactive, ref, watch} from "vue";
    import {asyncRequest}                                    from "@/js/web";
    import PublicationView                                   from "@/components/commons/publications/PublicationView";
    import Loader                                            from "@/components/Loader";
    import {useStore}                                        from 'vuex'

    export default {
        name: "Content",
        components: {
            Loader,
            List,
            PublicationView
        },
        setup(props, context) {
            const api = inject('$api')
            const showedPublication = ref(null)
            const store = useStore()

            /**
             * Массив публикацй
             * */
            // const publList = reactive({
            //     newP: store.getters.publications({
            //         shift: 0,
            //         count: 10,
            //     }).slice(0, 1),
            //     otherP: []
            // })

            // store.dispatch('loadPublication', {
            //     shift: 0,
            //     count: 10,
            // })

            const newP = computed(() => {
                const p = store.getters.publications({
                        shift: 0,
                        count: 10,
                    })
                console.log(['newP', p])
                return  p.slice(0, 1)
            })


            /**
             * Кол-во загружаемых публикаций
             * */
            const amountLoad = ref(10)

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
                                    for (const key of Object.keys(publList.newP)) {
                                        delete publList.newP[key]
                                    }
                                    for (const key of Object.keys(publList.otherP)) {
                                        delete publList.otherP[key]
                                    }
                                }

                                console.log(data.datas.findings)
                                for (let i = 0; i < data.datas.findings.length; i++) {
                                    const obj = data.datas.findings[i]
                                    if (i < 4) {
                                        publList.newP[obj._id] = obj
                                    }
                                    else {
                                        publList.otherP[obj._id] = obj
                                    }
                                }
                            }

                        }, 300)
                    }
                }

                const samplingTerm = {
                    shift: shift,
                    count: count,
                }

                const urlRequest = api.MODEL_REQUESTS.work_e(api.ESSENCE.publication.name, api.ESSENCE.publication.actions.findSample)

                asyncRequest(urlRequest, JSON.stringify(samplingTerm))
                    .then(resolve)
                    .catch(err => console.log(err))
            }

            // loadPublications(
            //     Object.keys(publList.newP).length + Object.keys(publList.otherP).length,
            //     amountLoad.value)


            return {
                newP,
                // publList,
                list_types,
                showPublication,
                showedPublication,
            }
        }
    }
</script>

<style lang="scss" scoped>

    .content-container {
        background-color: var(--primary_color);
        border-radius: 10px;
        padding: 5px;
        width: 1330px;

        .new-content {

            display: grid;
            align-self: stretch;
            justify-self: stretch;
            align-content: center;

        }

        .other-content {
            display: grid;
            align-self: stretch;
            justify-self: stretch;
            align-content: center;
            justify-content: stretch;
        }
    }

    @media (max-width: 1350px) {
        .content-container {
            width: calc(100vw - 20px);
            margin: 0 5px;
        }
    }

</style>
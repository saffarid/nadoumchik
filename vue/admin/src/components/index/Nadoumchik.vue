<template>
    <div>
        <BorderPane class="n">
            <template v-slot:top>
                <Header/>
            </template>
            <template v-slot:left v-if="isReady">
                <div class="ads" v-if="systemData.ads.isShowingAds">
                    <img src="https://i01.fotocdn.net/s111/260ae80cce6d159a/public_pin_m/2488908908.jpg" height="300"
                         width="200"/>
                </div>
            </template>
            <template v-slot:center>
                <div class="list-of-publications"
                     style="display:grid; justify-self: center; justify-items: center; height: 100%;">
                    <PublicationList
                            class="lst"
                            :figure="true"
                            @read="showPublication"/>
                </div>
            </template>
            <template v-slot:right v-if="isReady">
                <div class="ads" v-if="systemData.ads.isShowingAds">
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
    import PublicationList from "@/components/commons/publications_list/PublicationList";
    import {
        provide,
        ref,
        inject
    }                      from "vue";
    import {
        BorderPane
    }                      from 'saffarid-ui-kit'
    import PublicationView from "@/components/commons/publications/PublicationView";
    import {asyncRequest}  from "@/js/web";

    export default {
        name: "Nadoumchik",
        components: {
            PublicationView,
            BorderPane,
            PublicationList,
            Header,
        },
        setup() {
            const api = inject('$api')
            const showedPublication = ref(null)
            const systemData = ref(null)
            const isReady = ref(false)

            asyncRequest(api.MODEL_REQUESTS.db(api.DATABASE.collections.system.name, api.ACTS.select), JSON.stringify({}))
                .then(data => {
                    systemData.value = data.datas.findings[0]
                    provide('system', systemData)
                    isReady.value = true
                })
                .catch(err => console.log(err))

            const showPublication = (publication) => {
                showedPublication.value = publication
            }

            return {
                showPublication,
                showedPublication,
                systemData,
                isReady
            }
        }
    }
</script>

<style lang="scss" scoped>

    .ads{
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
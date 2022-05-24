<template>
    <div>
        <BorderPane>
            <template v-slot:top>
                <Header/>
            </template>
            <template v-slot:center>
                <div class="ads-left" v-if="systemData.ads.isShowingAds">
                    <img src="https://i01.fotocdn.net/s111/260ae80cce6d159a/public_pin_m/2488908908.jpg" height="300"
                         width="200"/>
                </div>
                <div class="list-with-ads">
                    <div class="list-of-publications"
                         style="display:grid; justify-self: center; justify-items: center; height: 100%;">
                        <PublicationList
                                class="lst"
                                :figure="true"
                                @read="showPublication"/>
                    </div>
                </div>
                <div class="ads-right" v-if="systemData.ads.isShowingAds">
                    <img src="https://i01.fotocdn.net/s111/260ae80cce6d159a/public_pin_m/2488908908.jpg" height="300"
                         width="200"/>
                </div>
            </template>
        </BorderPane>
        <PublicationView
                v-if="showedPublication._id"
                :publication="showedPublication"
                @close="closePublication"
        />
    </div>
</template>

<script>
    import Header          from "@/components/commons/Header";
    import PublicationList from "@/components/commons/publications_list/PublicationList";
    import {
        reactive,
        provide,
        ref
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
            const publicationIsShow = ref(false)
            const showedPublication = reactive({
                _id: undefined,
                dateStamp: undefined,
                content: {
                    title: 'Your title is here',
                    content: 'Your publication`s content is here'
                },
                preview: {
                    imgOnLeft: true,
                    backgroundColor: '#640707',
                    textIsDark: true,
                    image: ''
                }
            })
            const systemData = ref(null)

            asyncRequest('/system/select', JSON.stringify({}))
                .then(data => {
                    systemData.value = data
                    provide('system', systemData)
                })
                .catch(err => console.log(err))

            const showPublication = (publication) => {
                showedPublication._id = publication._id
                showedPublication.dateStamp = publication.dateStamp
                showedPublication.content = publication.content
                showedPublication.preview = publication.preview
                showedPublication.view = publication.view
            }
            const closePublication = () => {
                showedPublication._id = undefined
                showedPublication.dateStamp = undefined
                showedPublication.content = undefined
                showedPublication.preview = undefined
                showedPublication.view = undefined
            }

            return {
                showPublication,
                showedPublication,
                publicationIsShow,
                closePublication,
                systemData
            }
        }
    }
</script>

<style lang="scss" scoped>
    .ads-left {
        grid-area: ads-left;
        position: fixed;
        right: calc(50% + (790px / 2) + 5px);
    }

    .ads-right {
        grid-area: ads-right;
        position: fixed;
        top: 112px;
        left: calc(50% + (790px / 2) + 5px);
    }

    .list-with-ads {
        display: grid;
        /*grid-template-columns: repeat(3, 1fr);*/
        /*grid-template-areas: "ads-left list ads-right";*/
        justify-self: center;
        justify-content: center;
        max-height: 85vh;
        overflow-y: auto;

        .list-of-publications {
            grid-area: list;

            .lst {
                .list {
                    overflow-y: hidden;
                    max-height: max-content;
                }
            }
        }
    }
</style>
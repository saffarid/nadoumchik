<template>
    <div>
        <BorderPane>
            <template v-slot:top>
                <Header/>
            </template>
            <template v-slot:center>
                <div class="list-with-ads">
                    <div class="ads">
                        <img src="https://i01.fotocdn.net/s111/260ae80cce6d159a/public_pin_m/2488908908.jpg" height="300" width="200"/>
                    </div>
                    <div class="list-of-publications"
                         style="display:grid; justify-self: center; justify-items: center; height: 100%">
                        <PublicationList
                                class="lst"
                                :figure="true"
                                @read="showPublication"/>
                    </div>
                    <div class="ads">
                        <img src="https://i01.fotocdn.net/s111/260ae80cce6d159a/public_pin_m/2488908908.jpg" height="300" width="200"/>
                    </div>
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
    import Header from "@/components/commons/Header";
    import PublicationList from "@/components/commons/publications_list/PublicationList";
    import {
        reactive,
        ref
    } from "vue";
    import {
        BorderPane
    } from 'saffarid-ui-kit'
    import PublicationView from "@/components/commons/publications/PublicationView";

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

            const showPublication = (publication) => {
                showedPublication._id = publication._id
                showedPublication.dateStamp = publication.dateStamp
                showedPublication.content = {
                    title: publication.content.title,
                    content: publication.content.content
                }
                showedPublication.preview = {
                    imgOnLeft: publication.preview.imgOnLeft,
                    backgroundColor: publication.preview.backgroundColor,
                    textIsDark: publication.preview.textIsDark,
                    image: publication.preview.image
                }
                showedPublication.view = publication.view
            }

            const closePublication = () => {
                showedPublication._id = undefined
                showedPublication.dateStamp = undefined
                showedPublication.content = undefined
                showedPublication.preview = undefined
            }

            return {
                showPublication,
                showedPublication,
                publicationIsShow,
                closePublication
            }
        }
    }
</script>

<style lang="scss" scoped>
    .list-with-ads{
        display: grid;
        grid-template-columns: repeat(3, min-content);
        justify-self: center;
        justify-content: center;
        max-height: 85vh;
        overflow-y: auto;
        .list-of-publications{
            .lst {
                .list {
                    overflow-y: hidden;
                    max-height: max-content;
                }
            }
        }
    }
</style>
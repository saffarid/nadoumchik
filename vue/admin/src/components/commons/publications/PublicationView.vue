<template>
    <Popup
            class="publication"
            @close="close"
            @keypress.esc="close">
        <template v-slot:header>
            <Title :publication="publication"/>
        </template>
        <template v-slot:content>
            <div ref="articleView">
            </div>
        </template>
    </Popup>
    <div class="close">
        <SvgClose
                @click="close"
                :fill="'#a5a5a5'"
                :height="40"
                :width="40"
        />
    </div>
</template>

<script>
    import {
        onMounted,
        ref,
        watch
    }               from "vue";
    import {
        Popup,
    }               from 'saffarid-ui-kit'
    import Title    from "@/components/commons/publications/Title";
    import SvgClose from "@/assets/img/SvgClose";

    export default {
        name: "PublicationView",
        components: {
            SvgClose,
            Title,
            Popup,
        },
        props: {
            publication: {
                type: Object,
                required: true
            }
        },
        setup(props, context) {
            const articleView = ref(null)


            const refreshContentView = () => {
                if (articleView.value !== null) {
                    articleView.value.innerHTML = props.publication.content.content
                }
            };

            onMounted(refreshContentView)
            watch(props, refreshContentView)

            const close = () => {
                context.emit('close')
            }

            return {
                articleView,
                close,
            }
        }
    }
</script>

<style lang="scss">

    @import "@/assets/style/popup.scss";

    .close {
        display: none;
        position: absolute;
        top: 1vh;
        right: 1vw;
        z-index: 200;
        border-radius: 50%;
        border: 2px #a5a5a5 solid;
    }

    .publication {
        z-index: 100;
        overflow-y: auto;
        height: min-content;
        height: 100%;
        width: 100vw !important;
        position: fixed !important;

        .popup {
            margin: 5px;
            min-height: 98vh;
            height: min-content;
            max-height: 100%;
            grid-template-rows: min-content auto 50px;

            .popup_header {
                font-size: 30px;
                display: grid;
                align-self: stretch;
                justify-self: stretch;
                align-content: stretch;
                justify-content: stretch;
                border-top-left-radius: 20px;
                border-top-right-radius: 20px;
                padding: 0;
            }

            .content {
                margin-top: 5px;
                padding-right: 5px;
                padding-bottom: 5px;
                padding-left: 5px;
                max-height: 100%;
            }
        }
    }

    @media (max-width: 1500px) {
        .publication .popup {
            width: 1125px;
            margin: 0 6.25px;
        }
    }

    @media (max-width: 1150px) {
        .close {
            display: grid;
        }
    }

    @media (max-width: 1137.5px) {
        .publication .popup {
            width: 98vw;
            height: 98%;
        }
    }

</style>